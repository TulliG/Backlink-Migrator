import { App, TFile } from "obsidian";
import { BMSettings, CalculationMethod, ScanResult } from "types";
import { countTotalLinks, countUniqueLinks } from "./counter";
import { isSource } from "utils/paths";




export class BacklinkScanner {

    private linkCache: Record<string, string[]> = {};

    // scans all the source folders and returns a list of files with a backlink count above the threshold
    public runFullScan(app: App, settings: BMSettings): ScanResult[] {
        const results: ScanResult[] = [];
        const allFiles = app.vault.getMarkdownFiles();
        const resolvedLinks = app.metadataCache.resolvedLinks;

        for (const file of allFiles) {
            this.linkCache[file.path] = Object.keys(resolvedLinks?.[file.path] || {}); 

            if (isSource(file.path, settings.sourceFolders, settings.includeSubfolders)) {
                const result = this.evaluateFile(app, settings, file);
                if (result) {
                    results.push(result);
                }
            }
        }
        return results;
    }

    // scans a modified file and checks for backlink changes
    public scanModifiedFile (app: App, settings: BMSettings, modifiedFile: TFile): ScanResult[] {
        const results: ScanResult[] = []

        const currentLinksMap = app.metadataCache.resolvedLinks?.[modifiedFile.path] || {};
        const currentLinks = Object.keys(currentLinksMap);

        const previousLinks = this.linkCache[modifiedFile.path] || [];

        const targetsToCheck = new Set([...currentLinks, ...previousLinks]);

        this.linkCache[modifiedFile.path] = currentLinks;

        for (const targetPath of targetsToCheck) {
            if (isSource(targetPath, settings.sourceFolders, settings.includeSubfolders)) {
                const targetFile = app.vault.getAbstractFileByPath(targetPath);

                if (targetFile instanceof TFile) {
                    const result = this.evaluateFile(app, settings, targetFile);
                    if (result) {
                        results.push(result);
                    }
                }
            }
        }
        return results;
    }

    // calculates the backlinks of a single file and checks if it meets the threshold
    public evaluateFile(app: App, settings: BMSettings, file: TFile): ScanResult | null {
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

    // function to reset the cache
    public clearScannerCache() {
        this.linkCache = {};
    }
}