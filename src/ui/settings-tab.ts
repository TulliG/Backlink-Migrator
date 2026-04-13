import { App, TFolder, PluginSettingTab, Setting } from "obsidian";
import type BacklinkMigrator from "../main";
import { FolderSuggestModal } from "./fuzzy-suggest-modal";
import { CalculationMethod } from "types";

export class BMSettingTab extends PluginSettingTab {
	plugin: BacklinkMigrator;

	constructor(app: App, plugin: BacklinkMigrator) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
		containerEl.empty();

		const allFolders = this.app.vault.getAllLoadedFiles()
        	.filter(f => f instanceof TFolder);

		new Setting(containerEl)
            .setHeading()
            .setName("General behavior");

		// auto scan toggle
		new Setting(containerEl)
			.setName("Automatic scan")
			.setDesc("Automatically scan and check for threshold when links are updated")
			.addToggle(toggle => {
				toggle
					.setValue(this.plugin.settings.autoScan)
					.onChange(async (value) => {
						this.plugin.settings.autoScan = value;
						await this.plugin.saveSettings();
					});
			});

		// toggle for scanning sub folders
		new Setting(containerEl)
			.setName("Scan subfolders")
			.setDesc("If disabled, the plugin will only scan notes located exactly in the root of the selected source folders")
			.addToggle(toggle => {
				toggle
					.setValue(this.plugin.settings.includeSubfolders)
					.onChange(async (value) => {
						this.plugin.settings.includeSubfolders = value;
						await this.plugin.saveSettings();
					});
			});

		// calculation method dropdown
		new Setting(containerEl)
			.setName("Backlinks calculation method")
			.setDesc("Chooses how backlinks are counted to reach the threshold")
			.addDropdown(dropdown => {
				dropdown
					.addOption(CalculationMethod.UNIQUE, "Count unique linking notes")
					.addOption(CalculationMethod.TOTAL, "Count total link mentions")
					.setValue(this.plugin.settings.calculationMethod)
					.onChange(async (value) => {
						this.plugin.settings.calculationMethod = value as CalculationMethod;
						await this.plugin.saveSettings();
					});
			});

		// threshold settings
		new Setting(containerEl)
			.setName("Backlink threshold")
			.setDesc("Minimum number of backlinks of a note to activate the migration of the note")
			.addText(text => {
				text.inputEl.type = "number";

				text.setValue(String(this.plugin.settings.threshold))
					.onChange(async (value) => {
						const parsedValue = parseInt(value);
						if (isNaN(parsedValue) || parsedValue <= 0) {
                    		return;
						}
						
						this.plugin.settings.threshold = parsedValue;
						await this.plugin.saveSettings();
					});
			});

		containerEl.createEl("hr");

		new Setting(containerEl)
            .setHeading()
            .setName("Folder configuration");

		// target folder setting
		new Setting(containerEl)
			.setName("Target folder")
			.setDesc("Target folder where the notes will be moved to after they reach the backlink threshold")
			.addDropdown(dropdown => {
                const { sourceFolders, includeSubfolders, targetFolder } = this.plugin.settings;

                allFolders.forEach(folder => {
                    if (folder.path === targetFolder) {
                        dropdown.addOption(folder.path, folder.path);
                        return;
                    }

                    if (sourceFolders.includes(folder.path)) return;

                    if (includeSubfolders) {
                        const isSubfolder = sourceFolders.some(src => folder.path.startsWith(src + "/"));
                        if (isSubfolder) return;
                    }

                    dropdown.addOption(folder.path, folder.path);
                });

                dropdown.setValue(this.plugin.settings.targetFolder)
                    .onChange(async (value) => {
                        this.plugin.settings.targetFolder = value;
                        await this.plugin.saveSettings();
                        this.display();
                    });
            });

		// add source folder button
		new Setting(containerEl)
			.setName("Source folders")
			.setDesc("Folders to monitor, notes reaching the threshold here will be moved to the target folder")
			.addButton(button => {
				button
					.setButtonText("Add source folder")
					.setCta()
					.onClick(() => {
						new FolderSuggestModal(this.app, this.plugin, this).open();
					})
			});

		// source folders list
		this.plugin.settings.sourceFolders.forEach((path, index) => {
			new Setting(containerEl)
				.setName(path)
				.addButton(button => {
					button
						.setIcon("trash")
						.setTooltip("Remove this source folder")
						.onClick(async () => {
							this.plugin.settings.sourceFolders.splice(index, 1);
							await this.plugin.saveSettings();
							this.display();
						});
				});
		});
	}
}