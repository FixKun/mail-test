import { test } from '../fixtures/test-options'
import { createRandomTextFile } from './helpers'
import { folderNames } from '../constants/enums'
import { dataDirPath } from '../constants/constants'
import data from '../data/mailTest.json'



test('mail-001 @smoke', async ({pageManager, onMainMailPage, onMailPage, onViewMailPage, onDocsPage}) => {
    const fileName = await createRandomTextFile(dataDirPath)
    const unreadCount = await pageManager.onMainMailPage().getUnreadCount()
    await onMainMailPage.clickCreateNewEmailButton()
    await onMailPage.sendEmailToRecipient(data.destinationEmail, data.mailSubject, `${dataDirPath}/${fileName}`)
    await onMainMailPage.waitForMailCountToIncrease(unreadCount)
    await onMainMailPage.selectUnreadEmailBySubject(data.mailSubject)
    await onViewMailPage.saveAttachmentByNameInMyDocuments(fileName)
    await onViewMailPage.header.goToDocs()
    await onDocsPage.dragAndDropDocumentToFolderByName(fileName, folderNames.trash)
    await onDocsPage.checkThatFileIsInTheFolder(fileName, folderNames.trash)
})