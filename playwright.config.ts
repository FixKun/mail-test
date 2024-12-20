import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, 'credentials.env') })

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://mailfence.com/',
    trace: 'on-first-retry',
    extraHTTPHeaders:{
      'Accept-Language': 'en-US,en;q=0.5'
    }
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json' },
      dependencies: ['setup'],
      teardown: 'envCleanup', 
    },
    {
      name: 'envCleanup',
      use: {
        ...devices['Desktop Chrome'],
        // Use prepared auth state.
        storageState: '.auth/user.json',
      },
      testMatch: 'envCleanup.setup.ts',
    }, 
    {
      name: 'setup', 
      testMatch: 'auth.setup.ts',
      use:{
        ...devices['Desktop Chrome'],
        headless: true,
        launchOptions: {
          args: ["--headless"]
      }
      }
    },
  ],
});
