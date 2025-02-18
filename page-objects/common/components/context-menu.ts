import { Locator, Page, test } from "@playwright/test"

export class ContextMenu {
    protected readonly page: Page
    private readonly menuItemByName: (name: string) => Locator

    constructor(page: Page){
        this.page = page
        this.menuItemByName = (text: string) => this.page.getByRole('link', {'name': text})
    }

    async clickMenuItemByName(menuItemName: string){
        await test.step(`Click "${menuItemName}" menu item in context menu`, async () => {
            await this.menuItemByName(menuItemName).click()
        })
    }
}