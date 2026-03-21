import { App, TFile } from "obsidian";

export async function migrateFiles(app: App, files: Iterable<TFile>, targetFolder: string): Promise<number> {
    let movedCount = 0;

    for (const f of files) {
        const newPath = `${targetFolder}/${f.name}`;

        try {
            await app.fileManager.renameFile(f, newPath);
            movedCount++;
        } catch (error) {
            console.error(`Error moving file ${f.name}:`, error);
        }
    }
    return movedCount;
}