import { Notice, Plugin, TFile, debounce } from 'obsidian';
import { DEFAULT_SETTINGS } from "./settings";
import { BMSettingTab } from "./ui/settings-tab"; 
import { BMSettings, ScanResult } from "./types";
import { isConfigValid } from 'utils/validation';
import { BacklinkScanner } from 'core/scanner';
import { MigrationDashboardModal } from 'ui/migration-modal';
import { migrateFiles } from 'core/migrator';

export default class BacklinkMigrator extends Plugin {

    settings!: BMSettings;

    private filesToScan: Set<TFile> = new Set();

    private scanner: BacklinkScanner = new BacklinkScanner();

    private processPendingScans = debounce(async () => {
        if (!this.settings.autoScan || !isConfigValid(this.settings, true)) {
            this.filesToScan.clear();
            return;
        }

        const resultsToMigrate: ScanResult[] = [];

        for (const file of this.filesToScan) {
            const results = this.scanner.scanModifiedFile(this.app, this.settings, file);
            resultsToMigrate.push(...results);
        }

        this.filesToScan.clear();

        const uniqueResultsMap = new Map<string, ScanResult>();
        for (const res of resultsToMigrate) {
            uniqueResultsMap.set(res.file.path, res);
        }
        const uniqueResults = Array.from(uniqueResultsMap.values());

        if (uniqueResults.length > 0) {
            await this.runAutoMigration(uniqueResults);
        }
    }, 2000, true);
    
    async onload() {
        await this.loadSettings();
        this.addSettingTab(new BMSettingTab(this.app, this));
        
        // ribbon icon that runs a manual scan
        this.addRibbonIcon("scan-text", "Run manual scan for backlink migrator", (event: MouseEvent) => {
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
        this.app.workspace.onLayoutReady(() => {
            this.registerEvent(
                this.app.metadataCache.on("resolve", (file: TFile) => {
                    if (!this.settings.autoScan) return;
                    if (file.extension !== "md") return;
                    this.filesToScan.add(file);
                    this.processPendingScans();
                })
            );
        });
    }

    onunload() {
        this.scanner.clearScannerCache();
    }

    async loadSettings() {
        const data = (await this.loadData()) as Partial<BMSettings> | null;
        this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    private runManualScan() {
        if (!isConfigValid(this.settings)) {
            return;
        }

        new Notice("Scanning source folders...");
        const results = this.scanner.runFullScan(this.app, this.settings);

        if (results.length <= 0) {
            new Notice("No notes to move found");
        } else {
            new MigrationDashboardModal(this.app, this, results).open();
        }
    }

    private async runAutoMigration(results: ScanResult[] ) {
        const targetFolder = this.settings.targetFolder;

        const filesToMove = results.map(r => r.file);
        
        const movedCount = await migrateFiles(this.app, filesToMove, targetFolder);

        if (movedCount > 0) {
            new Notice(`Auto-migrated ${movedCount} notes to ${targetFolder}`);
        }
    }
}
