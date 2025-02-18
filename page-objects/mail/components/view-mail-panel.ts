import { Locator, Page, test } from "@playwright/test"
import { BasePage } from "../../common/base-page"
import { ContextMenu } from "../../common/components/context-menu"

export class ViewMailPanel extends BasePage{
    private readonly attachmentByFilename: (name: string) => Locator
    private readonly documentPopup: Locator
    private readonly rootNodeInDocList: Locator
    private readonly saveButtonInDocPopup: Locator
    readonly fileContextMenu: ContextMenu

    constructor(page: Page){
        super(page)
        this.attachmentByFilename = (text: string) => this.page.locator(`a[title*="${text}"]`)
        this.documentPopup = this.page.locator('div[hidefocus="true"]', {'hasText': 'Document'})
        this.fileContextMenu = new ContextMenu(this.page)
        this.rootNodeInDocList = this.documentPopup.locator('.treeItemLabel').first()
        this.saveButtonInDocPopup = this.documentPopup.locator('#dialBtn_OK:not(.GCSDBRWBMB)')
    }

    private async openAttachmentContextMenu(attachmentName: string){
        await test.step(`Open attachment context menu`, async () => {
            await this.attachmentByFilename(attachmentName).click({'button': 'right'})
        })
    }

    private async clickSaveInDocumentsListItemInAttachmentPopup(){
        await test.step(`Save documents in My Documents`, async () => {
            const responsePromise  = this.page.waitForResponse(
                resp => resp.url().includes('/gwt') 
                && resp.request().postData().includes('getDirectoriesTree')
            )
            await this.fileContextMenu.clickMenuItemByName('Save in Documents')
            await responsePromise 
        })
    }

    private async selectRootNodeInDocsList(){
        await test.step(`Select root node in documents list`, async () => {
            await this.rootNodeInDocList.click()
        })
    }

    private async clickSaveInDocsPopup(){
        await test.step(`Click Save in popup`, async () => {
            await this.saveButtonInDocPopup.click()
        })
    }

    async saveAttachmentByNameInMyDocuments(attachmentName: string){
        await test.step(`Save attachment by name "${attachmentName}" in My Documents`, async () => {
            await this.openAttachmentContextMenu(attachmentName)
            await this.clickSaveInDocumentsListItemInAttachmentPopup()
            await this.selectRootNodeInDocsList()
            await this.clickSaveInDocsPopup()
        })
    }

}