import { App, TFile } from "obsidian";
import { BMSettings, CalculationMethod, ScanResult } from "types";
import { countTotalLinks, countUniqueLinks } from "./counter";


// scans all the source folders and returns a list of files with a backlink count above the threshold
export function runFullScan(app: App, settings: BMSettings): ScanResult[] {
    const results: ScanResult[] = [];
    const allFiles = app.vault.getMarkdownFiles();

    for (const file of allFiles) {
        if (isSource(file.path, settings.sourceFolders)) {
            const result = evaluateFile(app, settings, file);
            if (result) {
                results.push(result);
            }
        }
    }
    return results;
}

// scans a modified file and checks for backlink changes
export function scanModifiedFile (app: App, settings: BMSettings, modifiedFile: TFile): ScanResult[] {
    const results: ScanResult[] = []

    const outgoingLinks = app.metadataCache.resolvedLinks?.[modifiedFile.path] || {};

    for (const targetPath in outgoingLinks) {
        if (isSource(targetPath, settings.sourceFolders)) {
            const targetFile = app.vault.getAbstractFileByPath(targetPath);

            if (targetFile instanceof TFile) {
                const result = evaluateFile(app, settings, targetFile);
                if (result) {
                    results.push(result);
                }
            }
        }
    }
    return results;
}

// helper function that checks if a file is in a SourceFolder
function isSource(filePath: string, sourceFolders: string[]): boolean {
    return sourceFolders.some(folder => {
        const normalized = folder.endsWith("/") ? folder : folder + "/";
        return filePath.startsWith(normalized);
    });
}

// helper function that calculates the backlinks of a single file and 
function evaluateFile(app: App, settings: BMSettings, file: TFile): ScanResult | null {
    const resolvedLinks = app.metadataCache.resolvedLinks;
    let backlinks = 0;

    if (!resolvedLinks) return null;

    if (settings.calculationMethod === CalculationMethod.UNIQUE) {
        backlinks = countUniqueLinks(file.path, resolvedLinks);
    } else {
        backlinks = countTotalLinks(file.path, resolvedLinks)
    }

    if (backlinks >= settings.threshold) {
        return { file, backlinks};
    }
    return null;
}