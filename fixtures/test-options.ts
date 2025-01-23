import { test as base } from '@playwright/test'
import * as fs from 'fs/promises'
import { dataDirPath } from '../constants/constants'
import { folderNames } from '../constants/enums'
import { DocsPage } from '../page-objects/documents/docs-page'
import { MailPage } from '../page-objects/mail/mail-page'
import { PageManager } from "../page-objects/page-manager"


export type TestOptions = {
    navigateToMainPage: string,
    pageManager: PageManager,
    mailPage: MailPage,
    docsPage: DocsPage,
    cleanupEmail: (mailSubject: string) => Promise<void>,
    cleanupDocument: (docName: string) => Promise<void>,
    cleanupFiles: (fileName: string) => Promise<void>,
}

export const test = base.extend<TestOptions>({

    navigateToMainPage: [async({ page }, use) => {
        await page.goto('/flatx/index.jsp')
        await use('') 
    }, {auto: true}],

    pageManager: async({ page, navigateToMainPage }, use) => {
        const pm = new PageManager(page)
        await use(pm)
    },

    mailPage: async ({ page }, use) => {
        await use(new MailPage(page))
    },

    docsPage: async ({ page }, use) => {
        await use(new DocsPage(page))
    },

    cleanupEmail: async({page}, use) => {

        async function cleanup(mailSubject: string) {
            const mail = new MailPage(page)
            await base.step(`Navigate to the main page`, async () => {
                await page.goto('/flatx/index.jsp')
            })
            // Cleanup Mail
            await base.step(`Cleanup Mail`, async () => {
                await mail.header.navigateToMail()
                for (const folder of [folderNames.inbox, folderNames.sent]) {
                    await mail.navPanel.openFolderByName(folder)
                    await mail.selectEmailsBySubject(mailSubject)
                    await mail.deleteSelected(false)
                }
                await mail.navPanel.openFolderByName(folderNames.trash)
                await mail.selectEmailsBySubject(mailSubject)
                await mail.deleteSelected(true)
            })
        }

        await use(cleanup)
    },

    cleanupDocument: async({page}, use) => {
        async function cleanup(docName: string) {
            const docs = new DocsPage(page)
            await base.step(`Navigate to the main page`, async () => {
                await page.goto('/flatx/index.jsp')
            })
            // Cleanup Document
            await base.step(`Cleanup Documents `, async () => {
                await docs.header.navigateToDocuments()
                await docs.navPanel.openRootFolder()
                await docs.selectDocumentsByName(docName)
                await docs.deleteSelected(false)
                await docs.navPanel.openFolderByName(folderNames.trash)
                await docs.selectDocumentsByName(docName)
                await docs.deleteSelected(true)
            })
        }

        await use(cleanup)
    },

    cleanupFiles: async({page}, use) => {
        async function cleanup(fileName: string) {
            // Cleanup file system
            await base.step(`Cleanup file system`, async () => {
                const filePath = `${dataDirPath}/${fileName}`
                try {
                    await fs.unlink(filePath)
                  } catch (error) {
                    console.warn(`File deletion failed: ${error.message}`)
                  }
            })
        }

        await use(cleanup)
    },
})

