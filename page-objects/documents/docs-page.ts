import { expect, Page, test } from "@playwright/test"
import { BaseListPage } from "../common/base-list-page"
import { NavPanel } from "../common/components/nav-panel"

export class DocsPage extends BaseListPage {
    readonly navPanel: NavPanel

    constructor(page: Page){
        super(page)
        this.navPanel = new NavPanel(this.page, this.page.locator('.treePanel', {'hasText': 'My Documents'}))
    }

    async documentByNameExists(name:string){
        await test.step(`Check that document with name "${name}" exists`, async () => {
          await expect(this.documentsByName(name).first()).toBeVisible()
        })
    }
    
    async selectAllItems(): Promise<boolean> {
        return await test.step(`Select all documents`, async () => {
          return this.baseSelectAllItems('getDocuments', '.docType')
        })
      }

      private async pageHasDocuments(timeout = 3000): Promise<boolean> {
        const result = await Promise.race([
          this.page.waitForSelector('div:has-text("no documents")', { state: 'attached', timeout })
            .then(() => false as const), 
          this.page.waitForSelector('.name', { state: 'attached', timeout })
            .then(() => true as const), 
        ]);
      
        return result
      }
  
      private async getDocumentsByName(name: string){
        const pageHasDocs = await this.pageHasDocuments()
        if (pageHasDocs){
          return this.page.locator('tr', { hasText: name })
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
          await this.documentByNameExists(fileName)
      })
    }
}