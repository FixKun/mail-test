import { Locator, Page, test } from "@playwright/test"

export class HeaderBar {
    private readonly page: Page
    private readonly emailButton: Locator
    private readonly documentsButton: Locator

    constructor(page: Page){
        this.page = page
        this.emailButton = this.page.locator('#nav-mail')
        this.documentsButton = this.page.locator('#nav-docs')
    }

    async navigateToMail(){
        await test.step(`Navigate to Mail page`, async () => {
            await this.emailButton.click()
        })
    }

    async navigateToDocuments(){
        await test.step(`Navigate to Documents page`, async () => {
            await this.documentsButton.click()
        })
    }
}