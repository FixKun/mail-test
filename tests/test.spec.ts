import { dataDirPath } from '../constants/constants'
import { folderNames } from '../constants/enums'
import data from '../data/mail-test.json'
import { test } from '../fixtures/test-options'
import { createRandomTextFile } from './helpers'

test.describe('E2E test', {
    tag: '@e2e'
}, () => {

    test.afterEach(async ({cleanupEmail, cleanupDocument, cleanupFiles}, testInfo) => {
        const subject = data.mailSubject + testInfo.testId
        await cleanupEmail(subject)
        const fileName = testInfo.annotations.find(a => a.type === 'fileName').description 
        await cleanupDocument(fileName)
        await cleanupFiles(fileName)
    })

    test('mail-001 - User can send an email with an attachment and manage the file lifecycle', {
        tag: '@smoke'
    },
    async ({mailPage, docsPage}, testInfo) => {
        const uniqueSubject = data.mailSubject + testInfo.testId 
        const file = await createRandomTextFile()
        testInfo.annotations.push({ type: 'fileName', description: file.fileName})
        await mailPage.startNewEmail()
        await mailPage.createMailForm.composeAndSendEmail(data.destinationEmail, uniqueSubject, file.filePath)
        await mailPage.waitForUnreadEmailBySubject(uniqueSubject)
        await mailPage.openUnreadEmailBySubject(uniqueSubject)
        await mailPage.viewMailPanel.saveAttachmentByNameInMyDocuments(file.fileName)
        await mailPage.header.navigateToDocuments()
        await docsPage.dragAndDropDocumentToFolderByName(file.fileName, folderNames.trash)
        await docsPage.verifyDocumentInFolder(file.fileName, folderNames.trash)
    })
})
