import { expect, Locator, Page, test } from "@playwright/test"
import { BaseListPage } from "../common/baseListPage"
import { NavPanelPage } from "../common/navPanel"

export class DocsPage extends BaseListPage {
    readonly navPanel: NavPanelPage 

    constructor(page: Page){
        super(page)
        this.navPanel = new NavPanelPage(this.page, this.page.locator('.treePanel', {'hasText': 'My Documents'}))
    }

    async documentByNameExists(name:string){
        await expect(this.documentsByName(name).first()).toBeVisible()
    }
    
    async selectAllItems(): Promise<boolean> {
        return this.selectAllItemsGeneric('getDocuments', '.docType')
      }

    // STEPS
    
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