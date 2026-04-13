# Backlink Migrator

Backlink Migrator is an Obsidian plugin that helps you organize your vault by moving notes from a source folder to a target folder once they reach a predefined number of backlinks.

It is designed for users who follow the **Zettelkasten** method, Evergreen Notes, or similar PKM (Personal Knowledge Management) workflows.

## 🚀 How it works

The plugin evaluates the notes in your **Source Folders** against your desired **Backlink Threshold**. Once a note reaches that threshold, it is ready to be moved to the **Target Folder**.

You have full control over when and how the migration happens:

- **Manual Scans:** Run the migration on demand via the ribbon icon or command palette whenever you are ready to organize your vault.
- **Automatic Mode:** Enable background monitoring to let the plugin quietly move notes as you link them.

## ⚙️ Configuration Guide

The settings are divided into two simple sections:

### 1. General Behavior

- **Automatic scan:** Enable this to automatically migrate notes as soon as you type a new link.
- **Calculation method:** Choose how backlinks are counted. You can count *Unique linking notes* (how many different notes link to the target) or *Total link mentions* (every single time the link appears, even in the same note).
- **Scan subfolders:** Choose whether to monitor all nested folders within your Source Folders. If disabled, the plugin will only scan notes located exactly in the root of the selected source folders.
- **Backlink threshold:** The magic number of backlinks required for a note to be moved.

### 2. Folder Configuration

- **Target folder:** The destination folder for your graduated notes (e.g., `02 - Zettels`).
- **Source folders:** The folders you want the plugin to monitor (e.g., `00 - Inbox`). You can add multiple folders. The plugin will intelligently prevent you from selecting nested folders or overlapping paths to avoid loops.

## ⚠️ Disclaimer

As with any plugin that modifies or moves files, please ensure you have a backup of your vault before using it. The plugin uses Obsidian's native API to safely rename files and update links, but backups are always recommended.
