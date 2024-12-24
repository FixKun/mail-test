import { test as setup, expect } from '@playwright/test'
import { DocsPage } from "../page-objects/documents/docsPage"
import { HeaderPage } from "../page-objects/common/headerPage"
import { MainMailPage } from "../page-objects/mail/mainMailPage"
import { folderNames } from '../constants/enums' 
import * as fs from 'fs/promises'

setup('cleanup environment', async ({page}) => {
    await page.goto('/flatx/index.jsp')
    const docs = new DocsPage(page)
    const mail = new MainMailPage(page)
    const header = new HeaderPage(page)
    // Cleanup file system
    const filePath = process.env.FILE_PATH
    if (filePath){
        await fs.unlink(filePath)
    }
    // Cleanup Documents 
    await header.goToDocs()
    await docs.openRootFolder()
    await docs.clearCurrentFolder(false)
    await docs.openFolderByName(folderNames.trash)
    await docs.clearCurrentFolder(true)
    // Cleanup Mail
    await header.goToMail()
    for (const folder of [folderNames.inbox, folderNames.sent]) {
        await mail.openFolderByName(folder)
        await mail.clearCurrentFolder(false)
    }
    await mail.openFolderByName(folderNames.trash)
    await mail.clearCurrentFolder(true)


})