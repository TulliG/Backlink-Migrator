import { App, TFolder, PluginSettingTab, Setting } from "obsidian";
import type BacklinkMigrator from "../main";
import { FolderSuggestModal } from "./fuzzy-suggest-modal";

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
        	.filter(f => f instanceof TFolder) as TFolder[];

		// threshold settings
		new Setting(containerEl)
			.setName("Backlink Threshold")
			.setDesc("Minimum number of backlinks of a note to activate the migration of the note")
			.addText(text => {
				text.inputEl.type = "number";

				text.setValue(String(this.plugin.settings.threshold))
					.onChange(async (value) => {
						const parsedValue = parseInt(value);
						if (isNaN(parsedValue) || parsedValue <= 0) {
                    		return;
						}
						
						text.inputEl.style.border = "";
						this.plugin.settings.threshold = parsedValue;
						this.plugin.saveSettings();
					})	
			});

		// target folder setting
		new Setting(containerEl)
			.setName("Target Folder")
			.setDesc("Target folder where the notes will be moved to after they reach the backlink threshold")
			.addDropdown(dropdown => {
				allFolders.forEach(folder => {
					const isSource = this.plugin.settings.sourceFolders.includes(folder.path);
					if (folder.path === this.plugin.settings.targetFolder || !isSource) {
						dropdown.addOption(folder.path, folder.path);
					}
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
			.setHeading()
			.setName("Source Folders")
			.setDesc("Folders to monitor. Notes reaching the threshold here will be moved to the Target Folder")
			.addButton(button => {
				button
					.setButtonText("Add Source Folder")
					.setCta()
					.onClick(() => {
						new FolderSuggestModal(this.app, this.plugin, this).open();
					})
			});

		// FolderSuggestModal 
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