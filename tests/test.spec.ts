import { dataDirPath } from '../constants/constants'
import { folderNames } from '../constants/enums'
import data from '../data/mail-test.json'
import { test } from '../fixtures/test-options'
import { createRandomTextFile } from './helpers'


test.describe('E2E test', {
    tag: '@e2e'
}, () => {

    test.afterEach(async ({cleanupEmail, cleanupDocument, cleanupFiles}, testInfo) => {
        const subject = data.mailSubject + testInfo.parallelIndex
        await cleanupEmail(subject)
        const fileName = process.env.FILE_NAME
        await cleanupDocument(fileName)
        await cleanupFiles(fileName)
    })

    test('mail-001 - User can send an email with an attachment and manage the file lifecycle', {
        tag: '@smoke'
    },
    async ({mailPage, docsPage}, testInfo) => {
        const uniqueSubject = data.mailSubject + testInfo.parallelIndex
        const fileName = await createRandomTextFile(dataDirPath)
        const unreadCount = await mailPage.getUnreadCount()
        await mailPage.startNewEmail()
        await mailPage.createMailForm.composeAndSendEmail(data.destinationEmail, uniqueSubject, `${dataDirPath}/${fileName}`)
        await mailPage.waitForNewEmail(unreadCount)
        await mailPage.openUnreadEmailBySubject(uniqueSubject)
        await mailPage.viewMailPanel.saveAttachmentByNameInMyDocuments(fileName)
        await mailPage.header.navigateToDocuments()
        await docsPage.dragAndDropDocumentToFolderByName(fileName, folderNames.trash)
        await docsPage.verifyDocumentInFolder(fileName, folderNames.trash)
    })
})
