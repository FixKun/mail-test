import { test } from '../test-options'
import { createRandomTextFile } from './helpers'
import data from '../data/mailTest.json'

test('mail-001 @smoke', async ({pageManager}) => {

    const dirPath = './data'
    const fileName = createRandomTextFile(dirPath)
    process.env.FILE_PATH = `${dirPath}/${fileName}`

    const unreadCount = await pageManager.onMainMailPage().getUnreadCount()

    await pageManager.onMainMailPage().clickCreateNewEmailButton()
    await pageManager.onMailPage().setMailRecipient(data.destinationEmail)
    await pageManager.onMailPage().setMailSubject(data.mailSubject)
    await pageManager.onMailPage().attachFile(`${dirPath}/${fileName}`)
    await pageManager.onMailPage().sendEmail()

    await pageManager.onMainMailPage().waitForMailCountToIncrease(unreadCount, 300, 50)
    await pageManager.onMainMailPage().selectUnreadEmailBySubject(data.mailSubject)
    
    await pageManager.onViewMailPage().saveAttachmentByNameInMyDocuments(fileName)

    await pageManager.onHeaderPage().goToDocs()

    await pageManager.onDocsPage().dragAndDropDocumentToFolderByName(fileName, 'Trash')
    await pageManager.onDocsPage().openFolderByName('Trash')
    await pageManager.onDocsPage().documentByNameExists(fileName)
})