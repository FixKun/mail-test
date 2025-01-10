import { Page, Locator } from "@playwright/test"
import { headerButtonNames as buttons } from '../../constants/enums' 
import { NavPanel } from "./components/navPanel"
import { BasePage } from "./basePage"

export abstract class BaseListPage extends BasePage{
    readonly abstract navPanel: NavPanel
    protected readonly selectAllCheckbox: Locator
    protected readonly documentsByName: (name: string) => Locator = (text: string) => this.page.locator('tbody tr', {'hasText': text})

    constructor(page: Page){
        super(page)
        this.selectAllCheckbox = this.page.locator('div[title="Select all"]')
    }

    abstract selectAllItems():Promise<boolean>

    async deleteSelected(needsConfirmation: boolean){
        const responsePromise  = this.page.waitForResponse(
            resp => resp.url().includes('/gwt')
        )
        await this.toolbar.clickToolbarItemByName(buttons.delete)
        if (needsConfirmation){
            await this.acceptDialog()
        }
        await responsePromise 

    }

    async clearCurrentFolder(needsConfirmation: boolean){
        const isSelected = await this.selectAllItems()
        if (isSelected){
            await this.deleteSelected(needsConfirmation)
        }
        
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
        await this.toolbar.refresh()
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