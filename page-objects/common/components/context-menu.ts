import { Locator, Page } from "@playwright/test"

export class ContextMenu {
    protected readonly page: Page
    private readonly menuItemByName: (name: string) => Locator

    constructor(page: Page){
        this.page = page
        this.menuItemByName = (text: string) => this.page.getByRole('link', {'name': text})
    }

    async clickMenuItemByName(menuItemName: string){
        await this.menuItemByName(menuItemName).click()
    }

}