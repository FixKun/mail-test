import { expect, Locator, Page } from "@playwright/test"
import { BaseListPage } from "../common/baseListPage"

export class DocsPage extends BaseListPage {
    protected readonly navPanel = this.page.locator('.treePanel', {'hasText': 'My Documents'})

    constructor(page: Page){
        super(page)
    }

    /**
     * Drag'n'drops document (docName) to a folder (folderName) in nav panel
     * @param docName Document name to drag'n'drop
     * @param folderName Drop location
     */
    async dragAndDropDocumentToFolderByName(docName: string, folderName: string){
        const document = this.documentsByName(docName)
        const targetFolder = this.navItemByName(folderName)
        await targetFolder.waitFor({ state: 'visible' })
        const box = await targetFolder.boundingBox()
        if (!box) {
            throw new Error(`Folder "${folderName}" is not visible. Nothing to interact with.`);
          }
        await document.hover()
        await this.page.mouse.down()
        await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
          steps: 5,
        });
        await this.page.mouse.up();
    }

    async documentByNameExists(name:string){
        await expect(this.documentsByName(name).first()).toBeVisible()
    }
    
    async selectAllItems(): Promise<boolean> {
        return this.selectAllItemsGeneric('getDocuments', '.docType')
      }

}