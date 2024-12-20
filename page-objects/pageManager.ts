import { Page } from "@playwright/test"
import { LoginPage } from "./loginPage"
import { MainMailPage } from "./mail/mainMailPage"
import { CreateMailPage } from "./mail/createMailPage"
import { ViewMailPage } from "./mail/viewMailPage"
import { HeaderPage } from "./common/headerPage"
import { DocsPage } from "./documents/docsPage"


export class PageManager{
    private readonly page: Page
    private readonly loginPage: LoginPage
    private readonly mainMailPage: MainMailPage
    private readonly mailPage: CreateMailPage
    private readonly viewMailPage: ViewMailPage
    private readonly headerPage: HeaderPage
    private readonly docsPage: DocsPage

    constructor(page: Page){
        this.page = page
        this.loginPage = new LoginPage(this.page)
        this.mainMailPage = new MainMailPage(this.page)
        this.mailPage = new CreateMailPage(this.page)
        this.viewMailPage = new ViewMailPage(this.page)
        this.headerPage = new HeaderPage(this.page)
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