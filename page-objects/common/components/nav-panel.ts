import { Locator, Page, test } from "@playwright/test"

export class NavPanel {
    private readonly page: Page
    private readonly parentLocator: Locator
    private readonly panelRootItem: Locator
    readonly navItemByName: (name: string) => Locator

    constructor(page: Page, locator: Locator){
        this.page = page
        this.parentLocator = locator
        this.panelRootItem = this.parentLocator.locator('div.treeItemRoot')
        this.navItemByName = (text: string) => this.parentLocator.locator('div[role="treeitem"]', {'hasText': text})
    }

    getNavItemByName(name: string){
        return this.navItemByName(name)
    }

    async openRootFolder(){
        await test.step(`Open navigation panel's root folder`, async () => {
            await this.panelRootItem.click()
        })
    }

    async openFolderByName(name: string){
        await test.step(`Open "${name}" folder in navigation panel`, async () => {
            await  this.getNavItemByName(name).click()
        })
    }

}