import { Locator, Page, test } from "@playwright/test"
import { BasePage } from "../../common/base-page"
import { ContextMenu } from "../../common/components/context-menu"

export class ViewMailPanel extends BasePage{
    private readonly attachmentByFilename: (name: string) => Locator
    private readonly documentPopup: Locator
    readonly fileContextMenu: ContextMenu

    constructor(page: Page){
        super(page)
        this.attachmentByFilename = (text: string) => this.page.locator(`a[title*="${text}"]`)
        this.documentPopup = this.page.locator('div[hidefocus="true"]', {'hasText': 'Document'})
        this.fileContextMenu = new ContextMenu(this.page)
    }

    private async openAttachmentContextMenu(attachmentName: string){
        await this.attachmentByFilename(attachmentName).click({'button': 'right'})
        const menuItems = this.page.locator('.menu li span')
    }

    private async clickSaveInDocumentsListItemInAttachmentPopup(){
        const responsePromise  = this.page.waitForResponse(
            resp => resp.url().includes('/gwt') 
            && resp.request().postData().includes('getDirectoriesTree')
        )
        await this.fileContextMenu.clickMenuItemByName('Save in Documents')
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