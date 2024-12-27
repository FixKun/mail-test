import {test as base} from '@playwright/test'
import { PageManager } from "../page-objects/pageManager"

export type TestOptions = {
    navigateToMainPage: string,
    pageManager: PageManager
}

export const test = base.extend<TestOptions>({

    navigateToMainPage: async({page}, use) => {
        await page.goto('/flatx/index.jsp')
        await use('')
    },

    pageManager: async({page, navigateToMainPage}, use) => {
        const pm = new PageManager(page)
        await use(pm)
    }

})