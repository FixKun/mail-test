import { test } from '../fixtures/test-options'
import { createRandomTextFile } from './helpers'
import { folderNames } from '../constants/enums'
import { dataDirPath } from '../constants/constants'
import data from '../data/mailTest.json'


test.describe('E2E test', {
    tag: '@e2e'
}, () => {
    test('mail-001 - User can send an email with an attachment and manage the file lifecycle', {
        tag: '@smoke'
    },
    async ({mailPage, docsPage}) => {
        const fileName = await createRandomTextFile(dataDirPath)
        const unreadCount = await mailPage.getUnreadCount()
        await mailPage.startNewEmail()
        await mailPage.createMailForm.composeAndSendEmail(data.destinationEmail, data.mailSubject, `${dataDirPath}/${fileName}`)
        await mailPage.waitForNewEmail(unreadCount)
        await mailPage.openUnreadEmailBySubject(data.mailSubject)
        await mailPage.viewMailPanel.saveAttachmentByNameInMyDocuments(fileName)
        await mailPage.header.navigateToDocuments()
        await docsPage.dragAndDropDocumentToFolderByName(fileName, folderNames.trash)
        await docsPage.verifyDocumentInFolder(fileName, folderNames.trash)
    })
})
