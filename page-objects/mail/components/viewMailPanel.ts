import { expect, Locator, Page, test } from "@playwright/test"
import { BasePage } from "../../common/basePage"

export class ViewMailPanel extends BasePage{
    private readonly attachmentByFilename: (name: string) => Locator
    private readonly documentPopup: Locator

    constructor(page: Page){
        super(page)
        this.attachmentByFilename = (text: string) => this.page.locator(`a[title*="${text}"]`)
        this.documentPopup = this.page.locator('div[hidefocus="true"]', {'hasText': 'Document'})
    }

    private async openAttachmentContextMenu(attachmentName: string){
        await this.attachmentByFilename(attachmentName).click({'button': 'right'})
        const menuItems = this.page.locator('.menu li span')
        await expect(menuItems).toContainText([/^Download (.*)$/, 'Save in Documents', 'Convert to PDF'])
    }

    private async clickSaveInDocumentsListItemInAttachmentPopup(){
        const responsePromise  = this.page.waitForResponse(
            resp => resp.url().includes('/gwt') 
            && resp.request().postData().includes('getDirectoriesTree')
        )
        await this.page.getByRole('link', {'name': 'Save in Documents'}).click()
        await responsePromise 
    }

    private async selectRootNodeInDocsList(){
        await this.documentPopup.locator('.treeItemLabel').first().click()
    }

    private async clickSaveInDocsPopup(){
        await this.documentPopup.locator('#dialBtn_OK:not(.GCSDBRWBMB)').click()
    }


    // STEPS
    async saveAttachmentByNameInMyDocuments(attachmentName: string){
        await test.step(`Save attachment by name "${attachmentName}" in My Documents`, async () => {
            await this.openAttachmentContextMenu(attachmentName)
            await this.clickSaveInDocumentsListItemInAttachmentPopup()
            await this.selectRootNodeInDocsList()
            await this.clickSaveInDocsPopup()
        })
    }

}