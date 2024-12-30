import { Page, Locator } from "@playwright/test"
import { HeaderPage } from "./headerPage"
import { ToolbarPage } from "./toolbarPage"

export abstract class BasePage{
    protected readonly page: Page
    protected readonly confirmationDialog: Locator
    readonly header: HeaderPage
    readonly toolbar: ToolbarPage

    constructor(page: Page){
        this.page = page
        this.confirmationDialog = this.page.locator('#msgBox')
        this.header = new HeaderPage(this.page)
        this.toolbar = new ToolbarPage(this.page)
    }

    async acceptDialog(){
        await this.confirmationDialog.locator('#dialBtn_YES').click()
    }

    async declineDialog(){
        await this.confirmationDialog.locator('#dialBtn_NO').click()
    }


}