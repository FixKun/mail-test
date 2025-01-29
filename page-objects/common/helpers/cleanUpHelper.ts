import { Page, test } from "@playwright/test"
import * as fs from 'fs/promises'
import { dataDirPath } from '../../../constants/constants'
import { folderNames } from '../../../constants/enums'
import { DocsPage } from "../../documents/docs-page"
import { MailPage } from "../../mail/mail-page"

export class CleanupHelper{
    readonly page: Page
    readonly docPage: DocsPage
    readonly mailPage: MailPage


    constructor(page: Page){
        this.page = page
        this.mailPage = new MailPage(this.page)
        this.docPage = new DocsPage(this.page)
    }

    async cleanupEmail(mailSubject: string) {
        await test.step(`Navigate to the main page`, async () => {
            await this.page.goto('/flatx/index.jsp')
        })
        // Cleanup Mail
        await test.step(`Cleanup Mail`, async () => {
            await this.mailPage.header.navigateToMail()
            for (const folder of [folderNames.inbox, folderNames.sent]) {
                await this.mailPage.navPanel.openFolderByName(folder)
                await this.mailPage.selectEmailsBySubject(mailSubject)
                await this.mailPage.deleteSelected(false)
            }
            await this.mailPage.navPanel.openFolderByName(folderNames.trash)
            await this.mailPage.selectEmailsBySubject(mailSubject)
            await this.mailPage.deleteSelected(true)
        })
    }

    async cleanupDocument(docName: string) {
        await test.step(`Navigate to the main page`, async () => {
            await this.page.goto('/flatx/index.jsp')
        })
        // Cleanup Document
        await test.step(`Cleanup Documents `, async () => {
            await this.docPage.header.navigateToDocuments()
            await this.docPage.navPanel.openRootFolder()
            await this.docPage.selectDocumentsByName(docName)
            await this.docPage.deleteSelected(false)
            await this.docPage.navPanel.openFolderByName(folderNames.trash)
            await this.docPage.selectDocumentsByName(docName)
            await this.docPage.deleteSelected(true)
        })
    }

    async cleanupFile(fileName: string) {
        // Cleanup file system
        await test.step(`Cleanup file system`, async () => {
            const filePath = `${dataDirPath}/${fileName}`
            try {
                await fs.unlink(filePath)
                } catch (error) {
                console.warn(`File deletion failed: ${error.message}`)
                }
        })
    }
}