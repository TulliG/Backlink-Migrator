import { Notice } from "obsidian";
import { BMSettings } from "types";

// checks if the plugin is correctly configured
export function isConfigValid(settings: BMSettings, silent: boolean = false): boolean {

    if (!settings.targetFolder || settings.targetFolder === '') {
        if (!silent) new Notice("Backlink Migrator: Target folder is missing. Please check settings.");
        return false;
    }
    if (!settings.sourceFolders || settings.sourceFolders.length === 0) {
        if (!silent) new Notice("Backlink Migrator: No source folders selected. Please check settings.");
        return false;
    }
    if (!settings.threshold || settings.threshold <= 0) {
        if (!silent) new Notice("Backlink Migrator: Threshold value not valid. Please check settings.");
        return false;
    }
    return true;
}