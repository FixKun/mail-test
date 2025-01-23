import { Page } from "@playwright/test"
import { headerButtonNames as buttons } from "../../../constants/enums"

export class Toolbar {
    private readonly page: Page

    constructor(page: Page){
        this.page = page
    }

    getToolbarItemByName(name: string){
        return this.page.locator('.toolbar').getByText(name)
    }

    // Generic function
    async clickToolbarItemByName(name: string, timeout = 2000){
        // const toolbarItem = this.getToolbarItemByName(name)
        await this.getToolbarItemByName(name).click()
    }

    // Common button on all pages
    async refresh(){
        await this.getToolbarItemByName(buttons.refresh).click()
    }

}