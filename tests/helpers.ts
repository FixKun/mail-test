import { faker as fake } from '@faker-js/faker'
import fs from 'fs'

/**
 * Creates a file with a random name and content. Returns file name
 * @param directoryPath A path to save a file. Will save into a current folder by default. Should be without a trailing slash
 * @returns A file name with .txt extension
 */
export function createRandomTextFile(directoryPath: string): string {
    const fileName = fake.system.commonFileName('txt')
    const fileContent = fake.lorem.words(30)

    if(!directoryPath){
        directoryPath = '.'
    }
    const fullPath = `${directoryPath}/${fileName}`

    fs.writeFileSync(fullPath, fileContent)

    return fileName
}