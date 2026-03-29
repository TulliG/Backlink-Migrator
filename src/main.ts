import { Notice, Plugin, TFile } from 'obsidian';
import { DEFAULT_SETTINGS } from "./settings";
import { BMSettingTab } from "./ui/settings-tab"; 
import { BMSettings, ScanResult } from "./types";
import { isConfigValid } from 'utils/validation';
import { runFullScan, scanModifiedFile } from 'core/scanner';
import { MigrationDashboardModal } from 'ui/migration-modal';
import { migrateFiles } from 'core/migrator';

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

        // auto-scan 
        this.registerEvent(
            this.app.metadataCache.on("resolve", async (file: TFile) => {
                if (!this.settings.autoScan) return;

                if (!isConfigValid(this.settings, true)) return;

                const results = scanModifiedFile(this.app, this.settings, file);

                if (results.length > 0) {
                    await this.runAutoMigration(results);
                }
            })
        );
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

    private async runAutoMigration(results: ScanResult[] ) {
        const targetFolder = this.settings.targetFolder;

        for (const r of results) {
            const movedCount = await migrateFiles(this.app, [r.file], targetFolder);

            if (movedCount > 0) {
                new Notice(`Auto-migrated: ${r.file.basename} (${r.backlinks} backlinks)`);
            }
        }
    }
}
