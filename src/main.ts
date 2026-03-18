import { Plugin } from 'obsidian';
import {DEFAULT_SETTINGS, BMSettingTab, BMSettings} from "./settings";

export default class BacklinkMigrator extends Plugin {

    settings: BMSettings;
    
    async onload() {
        await this.loadSettings();
        this.addSettingTab(new BMSettingTab(this.app, this));
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
