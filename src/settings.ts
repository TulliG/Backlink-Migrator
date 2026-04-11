import { BMSettings, CalculationMethod } from "types";

export const DEFAULT_SETTINGS: BMSettings = {
	threshold: 10,
	targetFolder: '',
	sourceFolders: [],
	autoScan: false,
	calculationMethod: CalculationMethod.UNIQUE,
	includeSubfolders: true
}

			