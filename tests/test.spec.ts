import { test } from '../fixtures/test-options'
import { createRandomTextFile } from './helpers'
import { folderNames } from '../constants/enums'
import { dataDirPath } from '../constants/constants'
import data from '../data/mailTest.json'



test('mail-001 @smoke', async ({pageManager}) => {
    const fileName = await createRandomTextFile(dataDirPath)
    const filePath = `${dataDirPath}/${fileName}`
    process.env.FILE_PATH = filePath

    const unreadCount = await pageManager.onMainMailPage().getUnreadCount()
    await pageManager.onMainMailPage().clickCreateNewEmailButton()
    await pageManager.onMailPage().sendEmailToRecipient(data.destinationEmail, data.mailSubject, filePath)
    await pageManager.onMainMailPage().waitForMailCountToIncrease(unreadCount)
    await pageManager.onMainMailPage().selectUnreadEmailBySubject(data.mailSubject)
    await pageManager.onViewMailPage().saveAttachmentByNameInMyDocuments(fileName)
    await pageManager.onHeaderPage().goToDocs()
    await pageManager.onDocsPage().dragAndDropDocumentToFolderByName(fileName, folderNames.trash)
    await pageManager.onDocsPage().checkThatFileIsInTheFolder(fileName, folderNames.trash)
})