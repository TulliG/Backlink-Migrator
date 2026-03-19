export interface BMSettings {
    threshold: number;
    targetFolder: string;
    sourceFolders: string[];
    autoScan: boolean;
    calculationMethod: CalculationMethod
}

export enum CalculationMethod {
    UNIQUE = "unique",
    TOTAL = "total"
}