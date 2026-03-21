import { Notice, Plugin } from 'obsidian';
import { DEFAULT_SETTINGS } from "./settings";
import { BMSettingTab } from "./ui/settings-tab"; 
import { BMSettings } from "./types";
import { isConfigValid } from 'utils/validation';
import { runFullScan } from 'core/scanner';
import { MigrationDashboardModal } from 'ui/migration-modal';

export default class BacklinkMigrator extends Plugin {

    settings: BMSettings;
    
    async onload() {
        await this.loadSettings();
        this.addSettingTab(new BMSettingTab(this.app, this));
        
        // ribbon icon that runs a manual scan
        this.addRibbonIcon("scan-text", "Run manual scan for Backlink Migrator", (event: MouseEvent) => {
            this.runManualScan();
        });

        // command that runs a manual scan
        this.addCommand({
            id: "run-manual-scan",
            name: "Run manual scan",
            callback: () => {
                this.runManualScan();
            }
        });

        // TODO: scan automatico dentro l'if (con altro if per il metodo di conteggio)
    }

    async onunload() {
    
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    private runManualScan() {
        if (!isConfigValid(this.settings)) {
                return;
            }

        new Notice("Scanning source folders...");
        const results = runFullScan(this.app, this.settings);

        if (results.length <= 0) {
            new Notice("No notes to move found");
        } else {
            new MigrationDashboardModal(this.app, this, results).open();
        }
    }
}
