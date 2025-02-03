import { expect, Locator, Page, test } from "@playwright/test"
import { BasePage } from "../common/base-page"
import { HeaderBar } from "../common/components/header-bar"
import { NavPanel } from "../common/components/nav-panel"
import { Toolbar } from "../common/components/toolbar"
import { ListPageHelper } from "../common/helpers/listPageHelper"

export class DocsPage extends BasePage {
    readonly navPanel: NavPanel
    readonly header: HeaderBar
    readonly toolbar: Toolbar
    private readonly docRowByDocName: (name: string) => Locator
    protected readonly selectAllCheckbox: Locator
    private documentRow: Locator
    protected readonly documentsByName: (name: string) => Locator = (text: string) => this.page.locator('tbody tr', {'hasText': text})

    constructor(page: Page){
        super(page)
        this.header = new HeaderBar(this.page)
        this.toolbar = new Toolbar(this.page)
        this.navPanel = new NavPanel(this.page, this.page.locator('.treePanel', {'hasText': 'My Documents'}))
        this.docRowByDocName = (text: string) => this.page.locator('tr', { hasText: text })
        this.selectAllCheckbox = this.page.locator('div[title="Select all"]')
        this.documentRow = this.page.locator('.docType')
    }

    async isDocumentByNameExists(name:string){
        await test.step(`Check that document with name "${name}" exists`, async () => {
          await expect(this.documentsByName(name).first()).toBeVisible()
        })
    }
    
    async selectAllItems(): Promise<boolean> {
        return await test.step(`Select all documents`, async () => {
          const listPageHelper = new ListPageHelper(this.page)
          await listPageHelper.waitForRefresh('getDocuments')

          const checkboxClasses = await this.selectAllCheckbox.getAttribute('class')
          const itemsCount = await this.documentRow.count()

          // click select all checkbox only if there's something to select
          if (!checkboxClasses?.includes('tbBtnActive') && itemsCount > 0){
              await this.selectAllCheckbox.click()
              return true
          } 
          return false
        })
      }

      private async pageHasDocuments(timeout = 3000): Promise<boolean> {
        const result = await Promise.race([
          this.page.waitForSelector('div:has-text("no documents")', { state: 'attached', timeout })
            .then(() => false as const), 
          this.page.waitForSelector('.name', { state: 'attached', timeout })
            .then(() => true as const), 
        ])
      
        return result
      }
  
      private async getDocumentsByName(name: string){
        const pageHasDocs = await this.pageHasDocuments()
        if (pageHasDocs){
          return this.docRowByDocName(name)
        } else {
          return this.page.locator('non-existent-selector')
        }
        
    }
  
      async selectDocumentsByName(name: string){
        await test.step(`Select all documents by name: ${name}`, async () => {
        let docs = await this.getDocumentsByName(name) 
        const count = await docs.count()
        for (let i = 0; i < count; i++) {
            await docs.nth(i).locator('.checkIcon').click()
        }
      })
    }

     /**
     * Drag'n'drops document (docName) to a folder (folderName) in nav panel
     * @param docName Document name to drag'n'drop
     * @param folderName Drop location
     */
    async dragAndDropDocumentToFolderByName(docName: string, folderName: string){
      await test.step(`Drag'n'drop ${docName} document to ${folderName} folder`, async () => {
          const document = this.documentsByName(docName)
          const targetFolder = this.navPanel.getNavItemByName(folderName)
          await this.page.waitForTimeout(20)
          await targetFolder.waitFor({ state: 'visible' })
          const box = await targetFolder.boundingBox()
          if (!box) {
              throw new Error(`Folder "${folderName}" is not visible. Nothing to interact with.`);
            }
          await document.hover()
          await this.page.mouse.down()
          await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
            steps: 5,
          })
          await this.page.mouse.up()
          
      })
    }

    async verifyDocumentInFolder(fileName: string, folderName: string){
      await test.step(`Validate that ${fileName} document is in ${folderName} folder`, async () => {
          await this.navPanel.openFolderByName(folderName)
          await this.isDocumentByNameExists(fileName)
      })
    }

    async deleteSelected(needsConfirmation: boolean){
      const listPageHelper = new ListPageHelper(this.page)
      await listPageHelper.deleteSelected(needsConfirmation)
    }
}