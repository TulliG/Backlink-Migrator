// function that checks if a folder or a file is/is in a Source Folder
export function isSource(filePath: string, sourceFolders: string[], includeSubfolders: boolean): boolean {
    const lastSlashIndex = filePath.lastIndexOf('/');
    const parentFolder = lastSlashIndex === -1 ? "" : filePath.substring(0, lastSlashIndex);

    return sourceFolders.some(folder => {
        const cleanFolder = folder.replace(/\/$/, "");

        if (includeSubfolders) {
            if (cleanFolder === "") return true; // Se la sorgente è la root, tutto matcha
            return filePath.startsWith(cleanFolder + "/");
        }

        return parentFolder === cleanFolder;
    });
}


