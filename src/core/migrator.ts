import { App, normalizePath, TFile, Notice } from "obsidian";

export async function migrateFiles(app: App, files: Iterable<TFile>, targetFolder: string): Promise<number> {
    let movedCount = 0;

    for (const f of files) {
        const newPath = normalizePath(`${targetFolder}/${f.name}`);

        if (f.path === newPath) {
            continue; 
        }

        const existingFile = app.vault.getAbstractFileByPath(newPath);
        if (existingFile) {
            console.warn(`Migrator: Skipped "${f.name}" because it already exists in the target folder.`);
            new Notice(`Skipped: "${f.name}" already exists in target folder.`);
            continue;
        }

        try {
            await app.fileManager.renameFile(f, newPath);
            movedCount++;
        } catch (error) {
            console.error(`Error moving file ${f.name}:`, error);
        }
    }
    return movedCount;
}