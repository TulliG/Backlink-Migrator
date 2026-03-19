import { Plugin } from 'obsidian';
import { DEFAULT_SETTINGS } from "./settings";
import { BMSettingTab } from "./ui/settings-tab"; 
import { BMSettings } from "./types";
import { isConfigValid } from 'utils/validation';

export default class BacklinkMigrator extends Plugin {

    settings: BMSettings;
    
    async onload() {
        await this.loadSettings();
        this.addSettingTab(new BMSettingTab(this.app, this));
        
        this.addRibbonIcon("scan-text", "Run manual scan for Backlink Migrator", (event: MouseEvent) => {
            if (!isConfigValid(this.settings)) {
                return;
            }
            // TODO: metodo di scan
        })


    }

    async onunload() {
    
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
