import { Page, Locator } from "@playwright/test"
import { HeaderBar } from "./components/header-bar"
import { Toolbar } from "./components/toolbar"

export abstract class BasePage{
    protected readonly page: Page
    protected readonly confirmationDialog: Locator
    readonly header: HeaderBar
    readonly toolbar: Toolbar

    constructor(page: Page){
        this.page = page
        this.confirmationDialog = this.page.locator('#msgBox')
        this.header = new HeaderBar(this.page)
        this.toolbar = new Toolbar(this.page)
    }

    async acceptDialog(){
        await this.confirmationDialog.locator('#dialBtn_YES').click()
    }

    async declineDialog(){
        await this.confirmationDialog.locator('#dialBtn_NO').click()
    }


}