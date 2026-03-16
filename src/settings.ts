import type BacklinkMigrator from "main";
import test from "node:test";
import {App, TFolder, PluginSettingTab, Setting, Notice} from "obsidian";
import { parse } from "path";

export interface BMSettings {
	threshold: number;
	targetFolder: string;
	sourceFolders: string[];

}

export const DEFAULT_SETTINGS: BMSettings = {
	threshold: 10,
	targetFolder: '',
	sourceFolders: []
}

export class BMSettingTab extends PluginSettingTab {
	plugin: BacklinkMigrator;

	constructor(app: App, plugin: BacklinkMigrator) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
		containerEl.empty();
		containerEl.createEl('h2', {text: 'Backlink Migrator settings'});

		const allFolders = this.app.vault.getAllLoadedFiles()
        	.filter(f => f instanceof TFolder) as TFolder[];

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
					})
			})
	}
	
}
