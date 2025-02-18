import { Locator, Page } from "@playwright/test"
import { headerButtonNames as buttons } from '../../../constants/enums'
import { Toolbar } from "../components/toolbar"
import { ConfirmationDialog } from "../components/confirmation-dialog"

export class ListPageHelper{
    readonly page: Page
    readonly toolbar: Toolbar
    readonly confirmationDialog: ConfirmationDialog
    protected readonly selectAllCheckbox: Locator
    protected readonly documentsByName: (name: string) => Locator = (text: string) => this.page.locator('tbody tr', {'hasText': text})

    constructor(page: Page){
        this.page = page
        this.toolbar = new Toolbar(this.page)
        this.confirmationDialog = new ConfirmationDialog(this.page)
        this.selectAllCheckbox = this.page.locator('div[title="Select all"]')
    }

    async deleteSelected(needsConfirmation: boolean){
        const responsePromise  = this.page.waitForResponse(
            resp => resp.url().includes('/gwt')
        )
        await this.toolbar.clickToolbarItemByName(buttons.delete)
        if (needsConfirmation){
            await this.confirmationDialog.acceptDialog()
        }
        await responsePromise 
    }

    /**
     * Waits for list refresh to finish
     * @param responseFilter A string that uniquely identifies request for a specific list 
     */
    async waitForRefresh(responseFilter: string): Promise<void> {
        const responsePromise = this.page.waitForResponse((resp) => {
            const postData = resp.request().postData();
            return (
                resp.url().includes('/gwt') &&
                postData !== null &&
                postData.includes(responseFilter)
            )
        })
        await this.toolbar.refresh()
        await responsePromise
    }
}