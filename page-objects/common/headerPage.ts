import { Locator, Page } from "@playwright/test"

export class HeaderPage {
    private readonly page: Page
    private readonly emailButton: Locator
    private readonly documentsButton: Locator

    constructor(page: Page){
        this.page = page
        this.emailButton = this.page.locator('#nav-mail')
        this.documentsButton = this.page.locator('#nav-docs')
    }

    async goToMail(){
        await this.emailButton.click()
    }

    async goToDocs(){
        await this.documentsButton.click()
    }
}