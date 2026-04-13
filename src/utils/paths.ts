import { normalizePath } from "obsidian";

// function that checks if a folder or a file is/is in a Source Folder
export function isSource(filePath: string, sourceFolders: string[], includeSubfolders: boolean): boolean {
    const cleanFilePath = normalizePath(filePath);
    const lastSlashIndex = cleanFilePath.lastIndexOf('/');
    const parentFolder = lastSlashIndex === -1 ? "" : cleanFilePath.substring(0, lastSlashIndex);

    return sourceFolders.some(folder => {
        const cleanFolder = normalizePath(folder); 

        if (includeSubfolders) {
            if (cleanFolder === "/" || cleanFolder === "") return true; 
            return cleanFilePath.startsWith(cleanFolder + "/");
        }

        return parentFolder === cleanFolder;
    });
}


