import { test as setup } from '@playwright/test'
import { LoginPage } from '../page-objects/login-page'

const authFile = '.auth/user.json'

setup('authentication', async({page}) => {
    await page.goto('/')
    const loginPage = new LoginPage(page)
    const username = process.env.LOGIN
    const password = process.env.PASSWORD
    if (!username || !password){
        throw new Error('No user credentials found. Please, set LOGIN and PASSWORD env vars')
    }
    await setup.step(`Login as ${username}`, async () => {
        await loginPage.loginWithCredentials(username, password)
        // wait until logged in
        await page.waitForResponse('https://mailfence.com/gwt')
        // and store state
        await page.context().storageState({path: authFile})
    })

})