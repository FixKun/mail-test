import { Locator, Page, test } from "@playwright/test"

export class NavPanel {
    private readonly page: Page
    private readonly parentLocator: Locator

    constructor(page: Page, locator: Locator){
        this.page = page
        this.parentLocator = locator
    }

    getNavItemByName(name: string){
        return this.parentLocator.locator('div[role="treeitem"]', {'hasText': name})
    }

    async openRootFolder(){
        await this.parentLocator.locator('div.treeItemRoot').click()
    }

    async openFolderByName(name: string){
        await  this.getNavItemByName(name).click()
    }

}