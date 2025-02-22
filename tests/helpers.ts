import { faker as fake } from '@faker-js/faker'
import { test } from "@playwright/test"
import fs from 'fs'
import { dataDirPath } from '../constants/constants'

/**
 * Creates a file with a random name and content. Returns file name and sets FILE_NAME env var
 * @param directoryPath A path to save a file. Will save into a current folder by default. Should be without a trailing slash
 * @returns A file name with .txt extension
 */
export async function createRandomTextFile() {
    return await test.step(`Create random file`, async () => {
        const fileName = fake.system.commonFileName('txt')
        const fileContent = fake.lorem.words(30)
        const filePath = `${dataDirPath}/${fileName}`

        fs.writeFileSync(filePath, fileContent)
        return {fileName, filePath}
    })
}
