import { test } from '../test-options'
import { createRandomTextFile } from './helpers'
import { folderNames } from '../constants/enums'
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

    await pageManager.onMainMailPage().waitForMailCountToIncrease(unreadCount)
    await pageManager.onMainMailPage().selectUnreadEmailBySubject(data.mailSubject)
    
    await pageManager.onViewMailPage().saveAttachmentByNameInMyDocuments(fileName)

    await pageManager.onHeaderPage().goToDocs()

    const trashFolderName = folderNames.trash
    await pageManager.onDocsPage().dragAndDropDocumentToFolderByName(fileName, trashFolderName)
    await pageManager.onDocsPage().openFolderByName(trashFolderName)
    await pageManager.onDocsPage().documentByNameExists(fileName)
})