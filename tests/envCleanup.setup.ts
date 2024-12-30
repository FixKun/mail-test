import { test as setup, expect } from '@playwright/test'
import { DocsPage } from "../page-objects/documents/docsPage"
import { HeaderPage } from "../page-objects/common/headerPage"
import { MainMailPage } from "../page-objects/mail/mainMailPage"
import { folderNames } from '../constants/enums' 
import { dataDirPath } from '../constants/constants'
import * as fs from 'fs/promises'

setup('cleanup environment', async ({page}) => {

    const docs = new DocsPage(page)
    const mail = new MainMailPage(page)
    const header = new HeaderPage(page)
    await setup.step(`Navigate to the main page`, async () => {
        await page.goto('/flatx/index.jsp')
    })
    // Cleanup file system
    await setup.step(`Cleanup file system`, async () => {
        const filePath = `${dataDirPath}/${process.env.FILE_NAME}`
        if (filePath){
            await fs.unlink(filePath)
        }
    })
    // Cleanup Documents 
    await setup.step(`Cleanup Documents `, async () => {
        await header.navigateToDocuments()
        await docs.navPanel.openRootFolder()
        await docs.clearCurrentFolder(false)
        await docs.navPanel.openFolderByName(folderNames.trash)
        await docs.clearCurrentFolder(true)
    })
    // Cleanup Mail
    await setup.step(`Cleanup Mail`, async () => {
        await header.navigateToMail()
        for (const folder of [folderNames.inbox, folderNames.sent]) {
            await mail.navPanel.openFolderByName(folder)
            await mail.clearCurrentFolder(false)
        }
        await mail.navPanel.openFolderByName(folderNames.trash)
        await mail.clearCurrentFolder(true)
    })


})