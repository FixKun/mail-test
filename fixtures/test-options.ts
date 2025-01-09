import {test as base, mergeTests} from '@playwright/test'
import { PageManager } from "../page-objects/pageManager"
import { MainMailPage } from '../page-objects/mail/mainMailPage'
import { CreateMailPage } from '../page-objects/mail/createMailPage'
import { ViewMailPage } from '../page-objects/mail/viewMailPage'
import { HeaderBar } from '../page-objects/common/headerBar'
import { DocsPage } from '../page-objects/documents/docsPage'

export type TestOptions = {
    navigateToMainPage: string,
    pageManager: PageManager,
    onMainMailPage: MainMailPage
    onMailPage: CreateMailPage,
    onViewMailPage: ViewMailPage, 
    onHeaderPage: HeaderBar,
    onDocsPage: DocsPage
}

export const test = base.extend<TestOptions>({

    navigateToMainPage: async({ page }, use) => {
        await page.goto('/flatx/index.jsp')
        await use('')
    },

    pageManager: async({ page, navigateToMainPage }, use) => {
        const pm = new PageManager(page)
        await use(pm)
    },

    onMainMailPage: [async ({ page }, use) => {
        await use(new MainMailPage(page))
    }, {auto: true}],

    onMailPage: async ({ page }, use) => {
        await use(new CreateMailPage(page))
    },

    onViewMailPage: async ({ page }, use) => {
        await use(new ViewMailPage(page))
    },

    onHeaderPage: async ({ page }, use) => {
        await use(new HeaderBar(page))
    },

    onDocsPage: async ({ page }, use) => {
        await use(new DocsPage(page))
    },

})

