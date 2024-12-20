import { Page, Locator } from "@playwright/test"

export abstract class BaseListPage{
    protected readonly page: Page
    protected readonly abstract navPanel: Locator
    protected readonly selectAllCheckbox: Locator
    protected readonly confirmationDialog: Locator
    protected readonly documentsByName: (name: string) => Locator = (text: string) => this.page.locator('tbody tr', {'hasText': text})
    protected readonly navItemByName: (name: string) => Locator = (text: string) => this.navPanel.locator('div[role="treeitem"]', {'hasText': text})
    protected readonly toolbarItemByName: (name: string) => Locator = (text: string) => this.page.locator('.toolbar').getByText(text)

    constructor(page: Page){
        this.page = page
        this.selectAllCheckbox = this.page.locator('div[title="Select all"]')
        this.confirmationDialog = this.page.locator('#msgBox')
    }

    abstract selectAllItems():Promise<boolean>

    async refreshList(){
        await this.toolbarItemByName('Refresh').click()
    }

    async acceptDialog(){
        await this.confirmationDialog.locator('#dialBtn_YES').click()
    }

    async declineDialog(){
        await this.confirmationDialog.locator('#dialBtn_NO').click()
    }

    async deleteSelected(needsConfirmation: boolean){
        const responsePromise  = this.page.waitForResponse(
            resp => resp.url().includes('/gwt')
        )
        await this.toolbarItemByName('Delete').click()
        if (needsConfirmation){
            await this.acceptDialog()
        }
        await responsePromise 

    }

    async openRootFolder(){
        await this.navPanel.locator('div.treeItemRoot').click()
    }

    async clearCurrentFolder(needsConfirmation: boolean){
        const isSelected = await this.selectAllItems()
        if (isSelected){
            await this.deleteSelected(needsConfirmation)
        }
        
    }

    async openFolderByName(name:string){
        await this.navItemByName(name).click()
    }

    /**
     * Will try to select all items in the list. Return value is needed to make a decision down the line.
     * E.g. if we want to click Delete or not.
     * @param responseFilter A string that uniquely identifies request for a specific list 
     * @param itemSelector CSS selector to identify a list item in the list
     * @returns Return true if there is something to select. Otherwise will return false
     */
     protected async selectAllItemsGeneric(
        responseFilter: string,
        itemSelector: string
      ): Promise<boolean> {
        /** Small workaround to make this reliably work. 
         * We'll refresh the list before selecting items and will wait for a response to avoid getting data too early */ 
        const responsePromise  = this.page.waitForResponse((resp) => {
            const postData = resp.request().postData()
            return (
              resp.url().includes('/gwt') &&
              postData !== null &&
              postData.includes(responseFilter)
            )
          }
        )
        await this.refreshList()
        await responsePromise 

        const checkboxClasses = await this.selectAllCheckbox.getAttribute('class')
        const itemsCount = await this.page.locator(itemSelector).count()

        // click select all checkbox only if there's something to select
        if (!checkboxClasses?.includes('tbBtnActive') && itemsCount > 0){
            await this.selectAllCheckbox.click()
            return true
        } 
        return false
      }
}