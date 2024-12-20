import { test } from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import { createRandomTextFile } from './helpers'
import data from '../data/mailTest.json'

test('mail-001 @smoke', async ({page}) => {
    const pm = new PageManager(page)

    await page.goto('/flatx/index.jsp')

    const dirPath = './data'
    const fileName = createRandomTextFile(dirPath)
    process.env.FILE_PATH = `${dirPath}/${fileName}`

    const unreadCount = await pm.onMainMailPage().getUnreadCount()

    await pm.onMainMailPage().clickCreateNewEmailButton()
    await pm.onMailPage().setMailRecipient(data.destinationEmail)
    await pm.onMailPage().setMailSubject(data.mailSubject)
    await pm.onMailPage().attachFile(`${dirPath}/${fileName}`)
    await pm.onMailPage().sendEmail()

    await pm.onMainMailPage().waitForMailCountToIncrease(unreadCount, 300, 50)
    await pm.onMainMailPage().selectUnreadEmailBySubject(data.mailSubject)
    
    await pm.onViewMailPage().saveAttachmentByNameInMyDocuments(fileName)

    await pm.onHeaderPage().goToDocs()

    await pm.onDocsPage().dragAndDropDocumentToFolderByName(fileName, 'Trash')
    await pm.onDocsPage().openFolderByName('Trash')
    await pm.onDocsPage().documentByNameExists(fileName)
})