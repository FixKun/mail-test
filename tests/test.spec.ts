import { test } from '../test-options'
import { createRandomTextFile } from './helpers'
import { folderNames } from '../constants/enums'
import data from '../data/mailTest.json'


test('mail-001 @smoke', async ({pageManager}) => {

    const trashFolderName = folderNames.trash
    const dirPath = './data'

    const fileName = await test.step(`Create random file`, async () => {
        return createRandomTextFile(dirPath)
    })
    const filePath = `${dirPath}/${fileName}`
    process.env.FILE_PATH = filePath

    const unreadCount = await test.step(`Get unread emails count`, async () => {
        return await pageManager.onMainMailPage().getUnreadCount()
    })

    await test.step(`Create and send email with subject: ${data.mailSubject} to ${data.destinationEmail}`, async () => {
        await pageManager.onMainMailPage().clickCreateNewEmailButton()
        await pageManager.onMailPage().setMailRecipient(data.destinationEmail)
        await pageManager.onMailPage().setMailSubject(data.mailSubject)
        await pageManager.onMailPage().attachFile(filePath)
        await pageManager.onMailPage().sendEmail()
    })

    await test.step(`Wait for unread counter to increase`, async () => {
        await pageManager.onMainMailPage().waitForMailCountToIncrease(unreadCount)
    })

    await test.step(`Get the latest unread email and save attachment to documents`, async () => {
        await pageManager.onMainMailPage().selectUnreadEmailBySubject(data.mailSubject)
        await pageManager.onViewMailPage().saveAttachmentByNameInMyDocuments(fileName)
    })

    await test.step(`Navigate to Documents page`, async () => {
        await pageManager.onHeaderPage().goToDocs()
    })

    await test.step(`Drag'n'drop ${fileName} document to ${trashFolderName} folder`, async () => {
        await pageManager.onDocsPage().dragAndDropDocumentToFolderByName(fileName, trashFolderName)
    })

    await test.step(`Validate that ${fileName} document is in ${trashFolderName} folder`, async () => {
        await pageManager.onDocsPage().openFolderByName(trashFolderName)
        await pageManager.onDocsPage().documentByNameExists(fileName)
    })

})