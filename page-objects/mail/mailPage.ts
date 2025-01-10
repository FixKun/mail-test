import { expect, Locator, Page, test } from "@playwright/test"
import { BaseListPage } from "../common/baseListPage"
import { headerButtonNames as buttons } from '../../constants/enums' 
import { NavPanel } from "../common/components/navPanel"
import { CreateMailForm } from "./components/createMailForm"
import { ViewMailPanel } from "./components/viewMailPanel"


export class MailPage extends BaseListPage {
    readonly navPanel: NavPanel
    readonly createMailForm: CreateMailForm
    readonly viewMailPanel: ViewMailPanel
    readonly createNewEmailButton: Locator
    readonly inboxMenu: Locator

    constructor(page: Page){
        super(page)
        this.createNewEmailButton = this.page.locator('#mailNewBtn')
        this.inboxMenu = this.page.locator('#treeInbox')
        this.navPanel = new NavPanel(this.page, this.page.locator('.treePanel', {'hasText': '@mailfence.com'}))
        this.createMailForm = new CreateMailForm(this.page)
        this.viewMailPanel = new ViewMailPanel(this.page)
    }

    async selectAllItems(): Promise<boolean> {
        return this.selectAllItemsGeneric('getFolderMessages', '.listSubject')
      }

      // STEPS
      async getUnreadCount(): Promise<number>{
        return await test.step(`Get unread emails count`, async () => {
            expect(this.inboxMenu).toBeVisible()
            const count = await this.inboxMenu.locator('div div').count()
            if(count > 0){
                const count = await this.inboxMenu.locator('div div').textContent()
                return Number(count)
            } else {
                return 0
            }
        }) 
    }

    async startNewEmail(){
        await test.step(`Open email creation frame`, async () => {
            await this.createNewEmailButton.click()
        })
    }

     /**
     * Function refreshes email list until number of unread emails will be greater than provided value or until times out
     * @param oldValue Value of unread emails before the check
     */
        async waitForNewEmail(oldValue: number){
            await test.step(`Wait for unread counter to increase`, async () => {
                await expect(async () => {
                    await this.toolbar.refresh()
                    let mailCount = await this.getUnreadCount()
                    expect(mailCount).toBeGreaterThan(oldValue)
                }).toPass()
            })
        }

    /**
     * Will select the latest email with a given subject
     * @param subject Email subject 
     */
    async openUnreadEmailBySubject(subject: string){
        await test.step(`Get the latest unread email by subject: ${subject}`, async () => {
            await this.page.locator('.listUnread', { hasText: subject}).first().click()
        })
    }
}