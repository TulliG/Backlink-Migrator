import BacklinkMigrator from "main";
import { FuzzySuggestModal, TFolder, App, Notice } from "obsidian";
import { BMSettingTab } from "./settings-tab";
import { isSource } from "utils/paths";

export class FolderSuggestModal extends FuzzySuggestModal<TFolder> {
    plugin: BacklinkMigrator;
    settingTab: BMSettingTab;

    constructor(app: App, plugin: BacklinkMigrator, settingTab: BMSettingTab) {
        super(app);
        this.plugin = plugin;
        this.settingTab = settingTab;
    }

    getItems(): TFolder[] {
        const allFolders = this.app.vault.getAllLoadedFiles()
            .filter(f => f instanceof TFolder) as TFolder[];

        return allFolders.filter(f => {
            const isSourceFolder = isSource(f.path, this.plugin.settings.sourceFolders);
            const isTarget = f.path == this.plugin.settings.targetFolder;
            const isRoot = f.path === "/";
            return !isSourceFolder && !isTarget && !isRoot;
        });
    }

    getItemText(item: TFolder): string {
        return item.path;
    }

    async onChooseItem(item: TFolder, evt: MouseEvent | KeyboardEvent) {
        this.plugin.settings.sourceFolders.push(item.path);
        await this.plugin.saveSettings();
        new Notice(`Added: ${item.path}`);
        this.settingTab.display();
    }

}