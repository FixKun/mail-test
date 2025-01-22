import { test as base } from '@playwright/test'
import { DocsPage } from '../page-objects/documents/docs-page'
import { MailPage } from '../page-objects/mail/mail-page'
import { PageManager } from "../page-objects/page-manager"

export type TestOptions = {
    navigateToMainPage: string,
    pageManager: PageManager,
    mailPage: MailPage
    docsPage: DocsPage
}

export const test = base.extend<TestOptions>({

    navigateToMainPage: [async({ page }, use) => {
        await page.goto('/flatx/index.jsp')
        await use('') 
    }, {auto: true}],

    pageManager: async({ page, navigateToMainPage }, use) => {
        const pm = new PageManager(page)
        await use(pm)
    },

    mailPage: async ({ page }, use) => {
        await use(new MailPage(page))
    },

    docsPage: async ({ page }, use) => {
        await use(new DocsPage(page))
    },

})

