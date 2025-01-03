import { test } from '../fixtures/test-options'
import { createRandomTextFile } from './helpers'
import { folderNames } from '../constants/enums'
import { dataDirPath } from '../constants/constants'
import data from '../data/mailTest.json'


test.describe('E2E test', {
    tag: '@e2e'
}, () => {
    test('mail-001 @smoke - User can send an email with an attachment and manage the file lifecycle', async ({pageManager, onMainMailPage, onMailPage, onViewMailPage, onDocsPage}) => {
        const fileName = await createRandomTextFile(dataDirPath)
        const unreadCount = await pageManager.onMainMailPage().getUnreadCount()
        await onMainMailPage.startNewEmail()
        await onMailPage.composeAndSendEmail(data.destinationEmail, data.mailSubject, `${dataDirPath}/${fileName}`)
        await onMainMailPage.waitForNewEmail(unreadCount)
        await onMainMailPage.openUnreadEmailBySubject(data.mailSubject)
        await onViewMailPage.saveAttachmentByNameInMyDocuments(fileName)
        await onViewMailPage.header.navigateToDocuments()
        await onDocsPage.dragAndDropDocumentToFolderByName(fileName, folderNames.trash)
        await onDocsPage.verifyDocumentInFolder(fileName, folderNames.trash)
    })
})
