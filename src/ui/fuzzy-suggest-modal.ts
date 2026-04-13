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
            .filter(f => f instanceof TFolder);

        const { sourceFolders, targetFolder, includeSubfolders } = this.plugin.settings;

        return allFolders.filter((f: TFolder) => {
            if (f.isRoot()) return false;
            if (f.path === targetFolder) return false;

            if (sourceFolders.includes(f.path)) return false;

            if (includeSubfolders) {
                const isSubfolderOfSource = sourceFolders.some(src => f.path.startsWith(src + "/"));
                if (isSubfolderOfSource) return false;
            }

            return true;
        });
    }

    getItemText(item: TFolder): string {
        return item.path;
    }

    onChooseItem(item: TFolder, evt: MouseEvent | KeyboardEvent) {
        this.plugin.settings.sourceFolders.push(item.path);
        
        // Esegue il salvataggio asincrono senza alterare la firma del metodo
        this.plugin.saveSettings()
            .then(() => {
                new Notice(`Added: ${item.path}`);
                this.settingTab.display();
            })
            .catch((error) => {
                console.error("Failed to save settings:", error);
                new Notice("Error saving settings");
            });
    }
}