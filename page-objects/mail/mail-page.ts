import { expect, Locator, Page, test } from "@playwright/test"
import { BasePage } from "../common/base-page"
import { HeaderBar } from "../common/components/header-bar"
import { NavPanel } from "../common/components/nav-panel"
import { Toolbar } from "../common/components/toolbar"
import { ListPageHelper } from "../common/helpers/listPageHelper"
import { CreateMailForm } from "./components/create-mail-form"
import { ViewMailPanel } from "./components/view-mail-panel"


export class MailPage extends BasePage {
    readonly navPanel: NavPanel
    readonly header: HeaderBar
    readonly toolbar: Toolbar
    readonly createMailForm: CreateMailForm
    readonly viewMailPanel: ViewMailPanel
    readonly createNewEmailButton: Locator
    readonly inboxMenu: Locator
    readonly unreadEmailBySubject: (subject: string) => Locator
    readonly emailBySubject: (subject: string) => Locator
    private readonly unreadCountDiv: Locator
    protected readonly selectAllCheckbox: Locator
    private emailRow: Locator
    private listPageHelper: ListPageHelper
    

    constructor(page: Page){
        super(page)
        this.createNewEmailButton = this.page.locator('#mailNewBtn')
        this.inboxMenu = this.page.locator('#treeInbox')
        this.navPanel = new NavPanel(this.page, this.page.locator('.treePanel', {'hasText': '@mailfence.com'}))
        this.header = new HeaderBar(this.page)
        this.toolbar = new Toolbar(this.page)
        this.createMailForm = new CreateMailForm(this.page)
        this.viewMailPanel = new ViewMailPanel(this.page)
        this.unreadEmailBySubject = (text: string) => this.page.locator('tr.listUnread', { hasText: text })
        this.emailBySubject = (text: string) => this.page.locator('tr', { hasText: text })
        this.unreadCountDiv = this.inboxMenu.locator('div div')
        this.selectAllCheckbox = this.page.locator('div[title="Select all"]')
        this.emailRow = this.page.locator('.listSubject')
        this.listPageHelper = new ListPageHelper(this.page)
    }

    async selectAllItems(): Promise<boolean> {
        return await test.step(`Select all documents`, async () => {
            await this.listPageHelper.waitForRefresh('getFolderMessages')

            const checkboxClasses = await this.selectAllCheckbox.getAttribute('class')
            const itemsCount = await this.emailRow.count()

            // click select all checkbox only if there's something to select
            if (!checkboxClasses?.includes('tbBtnActive') && itemsCount > 0){
                await this.selectAllCheckbox.click()
                return true
            } 
            return false
        })
      }


    private async getEmailsBySubject(subject: string){
        await this.page.waitForSelector('.listSubject', { state: 'attached', timeout: 5000 })
        return this.emailBySubject(subject)
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

      async getUnreadCount(): Promise<number>{
        return await test.step(`Get unread emails count`, async () => {
            expect(this.inboxMenu).toBeVisible()
            const count = await this.unreadCountDiv.count()
            if(count > 0){
                const count = await this.unreadCountDiv.textContent()
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
                    let mail = this.unreadEmailBySubject(subject) 
                    await expect(mail, `Email with subject "${subject}" was not found in the inbox`).toBeAttached() 
                }).toPass()
            })
        }


    /**
     * Will select the latest email with a given subject
     * @param subject Email subject
     */
    async openUnreadEmailBySubject(subject: string){
        await test.step(`Get the latest unread email by subject: ${subject}`, async () => {
            await this.unreadEmailBySubject(subject).first().click()
        })
    }

    async deleteSelected(needsConfirmation: boolean){
        await this.listPageHelper.deleteSelected(needsConfirmation)
      }
}