import { Notice } from "obsidian";
import { BMSettings } from "types";

// checks if the plugin is correctly configured
export function isConfigValid(settings: BMSettings, silent: boolean = false): boolean {

    if (typeof settings.targetFolder !== 'string') {
        if (!silent) new Notice("Backlink migrator: target folder is missing, please check settings.");
        return false;
    }
    if (!settings.sourceFolders || settings.sourceFolders.length === 0) {
        if (!silent) new Notice("Backlink migrator: no source folders selected, please check settings.");
        return false;
    }
    if (!settings.threshold || settings.threshold <= 0) {
        if (!silent) new Notice("Backlink migrator: threshold value not valid, please check settings.");
        return false;
    }
    return true;
}