import BacklinkMigrator from "main";
import { App, Modal, TFile, Setting, Notice } from "obsidian";
import { ScanResult } from "types";

export class MigrationDashboardModal extends Modal {
    plugin: BacklinkMigrator;
    results: ScanResult[];
    selectedFiles: Set<TFile>;

    constructor(app: App, plugin: BacklinkMigrator, results: ScanResult[]) {
        super(app);
        this.plugin = plugin;
        this.results = results;
        this.selectedFiles = new Set(results.map(r => r.file));
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        
        contentEl.createEl('h2', {text: 'Notes ready for migration'});
        contentEl.createEl("p", {text: "Select the note you want to move to the target folder"});

        // note toggles
        this.results.forEach(r => {
            new Setting(contentEl)
                .setName(r.file.basename)
                .setDesc("Backlinks counted: " + r.backlinks)
                .addToggle(toggle => {
                    toggle
                        .setValue(true)
                        .onChange((isToggled) => {
                            if (isToggled) {
                                this.selectedFiles.add(r.file);
                            } else {
                                this.selectedFiles.delete(r.file);
                            }
                        });
                });
        });

        // cancel and confirm buttons
        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText("Cancel")
                .onClick(() => {
                    this.close();
                })
            )
            .addButton(btn => btn
                .setButtonText(`Migrate ${this.selectedFiles.size} notes`)
                .onClick(async () => {
                    this.close();
                    await this.migrateSelectedFiles();
                })
            );
        
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }

    // function that moves the selected files
    async migrateSelectedFiles() {
        if (this.selectedFiles.size == 0) {
            new Notice("No notes selected for migration");
            return;
        }

        const targetFolder = this.plugin.settings.targetFolder;
        let movedCount = 0;

        for (const file of this.selectedFiles) {
            const newPath = `${targetFolder}/${file.name}`;

            try {
                await this.app.fileManager.renameFile(file, newPath);
                movedCount++;
            } catch (error) {
                console.error(`Error moving file ${file.name}:`, error);
            }
        }

        new Notice(`Successfully moved ${movedCount} notes to ${targetFolder}`);
    }
}