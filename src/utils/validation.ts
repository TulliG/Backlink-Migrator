import { Notice } from "obsidian";
import { BMSettings } from "types";

// checks if the plugin is correctly configured
export function isConfigValid(settings: BMSettings): boolean {

    if (!settings.targetFolder || settings.targetFolder === '') {
        new Notice("Backlink Migrator: Target folder is missing. Please check settings.");
        return false;
    }
    if (!settings.sourceFolders || settings.sourceFolders.length === 0) {
        new Notice("Backlink Migrator: No source folders selected. Please check settings");
        return false;
    }
    if (!settings.threshold || settings.threshold <= 0) {
        new Notice("Backlink Migrator: Threshold value not valid. Please check settings");
        return false;
    }
    return true;
}