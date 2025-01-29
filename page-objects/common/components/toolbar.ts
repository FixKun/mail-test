import { Page, Locator, test, expect } from "@playwright/test"
import { headerButtonNames as buttons } from "../../../constants/enums"

export class Toolbar {
    private readonly page: Page
    private readonly toolbarItemByName: (subject: string) => Locator

    constructor(page: Page){
        this.page = page
        this.toolbarItemByName = (text: string) => this.page.locator('.toolbar').getByText(text)
    }

    getToolbarItemByName(name: string){
        return this.toolbarItemByName(name)
    }

    // Generic function
    async clickToolbarItemByName(name: string, timeout = 2000){
        await test.step(`Click "${name}" button in the toolbar`, async () => {
            const toolbarItem = this.getToolbarItemByName(name)
            await expect(toolbarItem).not.toHaveClass('tbBtnDisabled')
            await toolbarItem.click()
        })
    }

    // Common button on all pages
    async refresh(){
        await test.step(`Click "Refresh" button in the toolbar`, async () => {
            await this.getToolbarItemByName(buttons.refresh).click()
        })
    }

}