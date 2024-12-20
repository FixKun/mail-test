import { Locator, Page } from "@playwright/test"

export class CreateMailPage {
    readonly page: Page
    readonly mailToField: Locator
    readonly mailSubjectField: Locator
    readonly attachmentMenu: Locator
    readonly sendEmailButton: Locator

    constructor(page: Page){
        this.page = page
        this.mailToField = this.page.getByRole('row', {name: 'To', exact: true}).getByRole('textbox')
        this.mailSubjectField = this.page.getByRole('row', {name: 'Subject', exact: true}).getByRole('textbox')
        this.attachmentMenu = this.page.getByText('Attachment')
        this.sendEmailButton = this.page.locator('#mailSend')
    }


    async setMailRecipient(recipient: string){
        await this.mailToField.fill(recipient)
    }

    async setMailSubject(subject: string){
        await this.mailSubjectField.fill(subject)
    }

    /**
     * Attaches a file to an email
     * @param filePath A path to a file to attach
     */
    async attachFile(filePath: string){
        await this.attachmentMenu.click()
        const responsePromise = this.page.waitForResponse('/sw?type=gwtmail*')
        await this.page.locator('input[type=file]').setInputFiles(filePath)
        await responsePromise
    }

    async sendEmail(){
        await this.sendEmailButton.click()
    }
}