import { Locator, Page, test } from "@playwright/test"
import { HeaderBar } from "./components/header-bar"
import { Toolbar } from "./components/toolbar"

export abstract class BasePage{
    protected readonly page: Page
    protected readonly confirmationDialog: Locator
    readonly header: HeaderBar
    readonly toolbar: Toolbar
    private readonly acceptDialogButton: Locator
    private readonly declineDialogButton: Locator

    constructor(page: Page){
        this.page = page
        this.confirmationDialog = this.page.locator('#msgBox')
        this.header = new HeaderBar(this.page)
        this.toolbar = new Toolbar(this.page)
        this.acceptDialogButton = this.confirmationDialog.locator('#dialBtn_YES')
        this.declineDialogButton = this.confirmationDialog.locator('#dialBtn_NO')
    }

    async acceptDialog(){
        await test.step(`Accept dialog`, async () => {
            await this.acceptDialogButton.click()
        })
    }

    async declineDialog(){
        await test.step(`Decline dialog`, async () => {
            await this.declineDialogButton.click()
        })
    }
}