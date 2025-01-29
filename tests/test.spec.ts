import { faker } from '@faker-js/faker'
import { folderNames } from '../constants/enums'
import data from '../data/mail-test.json'
import { test } from '../fixtures/test-options'
import { createRandomTextFile } from './helpers'

let file: { fileName: string; filePath: string }
let uniqueSubject: string
let destinationEmail: string

test.describe('E2E test', {
    tag: '@e2e'
}, () => {

    test.afterEach(async ({cleanupHelper }) => {
        await cleanupHelper.cleanupEmail(uniqueSubject)
        await cleanupHelper.cleanupDocument(file.fileName)
        await cleanupHelper.cleanupFile(file.fileName)
    })

    test.beforeEach(async () => {
        uniqueSubject = data.mailSubject + faker.string.alphanumeric(5)
        file = await createRandomTextFile()
        destinationEmail = process.env.LOGIN + '@mailfence.com'
    })

    test('mail-001 - User can send an email with an attachment and manage the file lifecycle', {
        tag: '@smoke'
    },
    async ({mailPage, docsPage}) => {
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
