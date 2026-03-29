// function that checks if a folder or a file is/is in a Source Folder
export function isSource(filePath: string, sourceFolders: string[]): boolean {
    return sourceFolders.some(folder => {
        const cleanFolder = folder.replace(/\/$/, "");
        const cleanPath = filePath.replace(/\/$/, "");
        
        if (cleanPath === cleanFolder) return true;
        
        return cleanPath.startsWith(cleanFolder + "/");
    });
}

