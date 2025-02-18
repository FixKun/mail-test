import { Locator, Page } from "@playwright/test"
import { BasePage } from "./common/base-page"

export class LoginPage extends BasePage{
    readonly signInButton: Locator
    readonly loginInput: Locator
    readonly passwordInput: Locator
    readonly submitButton: Locator

    constructor(page: Page){
        super(page)
        this.signInButton = this.page.locator('#signin')
        this.loginInput = this.page.locator('#UserID')
        this.passwordInput = this.page.locator('#Password')
        this.submitButton = this.page.getByRole('button', {name: 'Enter'})
    }


    async loginWithCredentials(login: string, password: string){
        await this.signInButton.click()
        await this.loginInput.fill(login)
        await this.passwordInput.fill(password)
        await this.submitButton.click()
    }
}