import { Page } from "@playwright/test"
import { LoginPage } from "./login-page"
import { MainMailPage } from "./mail/mail-page"
import { CreateMailPage } from "./mail/components/create-mail-form"
import { ViewMailPage } from "./mail/components/view-mail-panel"
import { HeaderBar } from "./common/components/header-bar"
import { DocsPage } from "./documents/docs-page"


export class PageManager{
    private readonly page: Page
    private readonly loginPage: LoginPage
    private readonly mainMailPage: MainMailPage
    private readonly mailPage: CreateMailPage
    private readonly viewMailPage: ViewMailPage
    private readonly headerPage: HeaderBar
    private readonly docsPage: DocsPage

    constructor(page: Page){
        this.page = page
        this.loginPage = new LoginPage(this.page)
        this.mainMailPage = new MainMailPage(this.page)
        this.mailPage = new CreateMailPage(this.page)
        this.viewMailPage = new ViewMailPage(this.page)
        this.headerPage = new HeaderBar(this.page)
        this.docsPage = new DocsPage(this.page)
    }

    onLoginPage(){
        return this.loginPage
    }

    onMainMailPage(){
        return this.mainMailPage
    }

    onMailPage(){
        return this.mailPage
    }

    onViewMailPage(){
        return this.viewMailPage
    }

    onHeaderPage(){
        return this.headerPage
    }

    onDocsPage(){
        return this.docsPage
    }
}