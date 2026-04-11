import { TFile } from "obsidian";

export interface BMSettings {
    threshold: number;
    targetFolder: string;
    sourceFolders: string[];
    autoScan: boolean;
    calculationMethod: CalculationMethod,
    includeSubfolders: boolean
}

export interface ScanResult {
    file: TFile;
    backlinks: number
}

export enum CalculationMethod {
    UNIQUE = "unique",
    TOTAL = "total"
}

export type ResolvedLinks = Record<string, Record<string, number>>;