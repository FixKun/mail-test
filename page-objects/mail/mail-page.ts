import { expect, Locator, Page, test } from "@playwright/test"
import { BaseListPage } from "../common/base-list-page"
import { NavPanel } from "../common/components/nav-panel"
import { CreateMailForm } from "./components/create-mail-form"
import { ViewMailPanel } from "./components/view-mail-panel"


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
        return this.baseSelectAllItems('getFolderMessages', '.listSubject')
      }

      private async getEmailsBySubject(subject: string){
        await this.page.waitForSelector('.listSubject', { state: 'attached', timeout: 5000 })
        return this.page.locator('tr', { hasText: subject })
    }

    async selectEmailsBySubject(subject: string){
            await test.step(`Select all emails by subject: ${subject}`, async () => {
            let emails = await this.getEmailsBySubject(subject) 
            const count = await emails.count()
            for (let i = 0; i < count; i++) {
                await emails.nth(i).locator('.checkIcon').click()
            }
        })
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
        async waitForNewEmail(){
            const oldValue = await this.getUnreadCount()
            await test.step(`Wait for unread counter to increase`, async () => {
                await expect(async () => {
                    await this.toolbar.refresh()
                    let mailCount = await this.getUnreadCount()
                    expect(mailCount).toBeGreaterThan(oldValue)
                }).toPass()
            })
        }

        async waitForUnreadEmailBySubject(subject: string){
            await test.step(`Wait for unread email with subject "${subject}"`, async () => {
                await expect(async () => {
                    await this.toolbar.refresh()
                    let mail = this.page.locator('tr.listUnread', { hasText: subject })
                    await expect(mail).toBeAttached()
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