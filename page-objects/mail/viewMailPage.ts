import { expect, Locator, Page } from "@playwright/test"

export class ViewMailPage {
    private readonly page: Page
    private readonly attachmentByFilename: (name: string) => Locator
    private readonly documentPopup: Locator

    constructor(page: Page){
        this.page = page
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

    async saveAttachmentByNameInMyDocuments(attachmentName: string){
        await this.openAttachmentContextMenu(attachmentName)
        await this.clickSaveInDocumentsListItemInAttachmentPopup()
        await this.selectRootNodeInDocsList()
        await this.clickSaveInDocsPopup()
    }

}