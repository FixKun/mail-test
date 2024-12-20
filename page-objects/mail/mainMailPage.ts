import { expect, Locator, Page } from "@playwright/test"
import { BaseListPage } from "../common/baseListPage"

export class MainMailPage extends BaseListPage {
    protected readonly navPanel = this.page.locator('.treePanel', {'hasText': '@mailfence.com'})

    readonly createNewEmailButton: Locator
    readonly inboxMenu: Locator
    readonly refreshButton: Locator

    constructor(page: Page){
        super(page)
        this.createNewEmailButton = this.page.locator('#mailNewBtn')
        this.inboxMenu = this.page.locator('#treeInbox')
        this.refreshButton = this.page.getByText('Refresh')
    }


    async clickCreateNewEmailButton(){
        await this.createNewEmailButton.click()
    }

    async refreshMailList(){
        await this.refreshButton.click()
    }

    async getUnreadCount(){
        expect(this.inboxMenu).toBeVisible()
        const count = await this.inboxMenu.locator('div div').count()
        if(count > 0){
            const count = await this.inboxMenu.locator('div div').textContent()
            return Number(count)
        } else {
            return 0
        }
    }

    /**
     * Function refreshes email list until number of unread emails will be greater than provided value or until times out
     * @param oldValue Value of unread emails before the check
     * @param iterationWaitTime Wait time after each check in ms
     * @param retries Number of retries
     */
    async waitForMailCountToIncrease(oldValue: number, iterationWaitTime: number, retries: number){
        for (let i = 0; i < retries; i++) {
            await this.refreshMailList()
            let mailCount = await this.getUnreadCount()
            if (oldValue < mailCount){
                break
            }
            await this.page.waitForTimeout(iterationWaitTime)
          }
    }

    /**
     * Will select the latest email with a given subject
     * @param subject Email subject 
     */
    async selectUnreadEmailBySubject(subject: string){
        await this.page.locator('.listUnread', { hasText: subject}).first().click()
    }

    async selectAllItems(): Promise<boolean> {
        return this.selectAllItemsGeneric('getFolderMessages', '.listSubject')
      }
}