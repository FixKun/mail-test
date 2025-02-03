import { test as base } from '@playwright/test'
import { DocsPage } from '../page-objects/documents/docs-page'
import { MailPage } from '../page-objects/mail/mail-page'
import { CleanupHelper } from '../page-objects/common/helpers/cleanup-helper'


export type TestOptions = {
    navigateToMainPage: string,
    mailPage: MailPage,
    docsPage: DocsPage,
    cleanupHelper: CleanupHelper
}

export const test = base.extend<TestOptions>({

    navigateToMainPage: [async({ page }, use) => {
        await page.goto('/flatx/index.jsp')
        await use('') 
    }, {auto: true}],

    mailPage: async ({ page }, use) => {
        await use(new MailPage(page))
    },

    docsPage: async ({ page }, use) => {
        await use(new DocsPage(page))
    },

    cleanupHelper: async ({ page }, use) => {
        await use(new CleanupHelper(page))
    },

})

