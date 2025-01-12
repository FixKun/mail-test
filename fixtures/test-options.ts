import {test as base, mergeTests} from '@playwright/test'
import { PageManager } from "../page-objects/pageManager"
import { MailPage } from '../page-objects/mail/mailPage'
import { DocsPage } from '../page-objects/documents/docsPage'

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

