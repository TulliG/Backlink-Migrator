// function that checks if a file is in a SourceFolder
export function isSource(filePath: string, sourceFolders: string[]): boolean {
    return sourceFolders.some(folder => {
        const normalized = folder.endsWith("/") ? folder : folder + "/";
        return filePath.startsWith(normalized);
    });
}

