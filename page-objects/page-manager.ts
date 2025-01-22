import { Page } from "@playwright/test"
import { DocsPage } from "./documents/docs-page"
import { LoginPage } from "./login-page"
import { MailPage } from "./mail/mail-page"


export class PageManager{
    private readonly page: Page
    private readonly loginPage: LoginPage
    private readonly mailPage: MailPage
    private readonly docsPage: DocsPage

    constructor(page: Page){
        this.page = page
        this.loginPage = new LoginPage(this.page)
        this.mailPage = new MailPage(this.page)
        this.docsPage = new DocsPage(this.page)
    }

    onLoginPage(){
        return this.loginPage
    }

    onMailPage(){
        return this.mailPage
    }

    onDocsPage(){
        return this.docsPage
    }
}