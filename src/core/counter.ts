import { ResolvedLinks } from "types";

// counts how many unique backlinks a note has
export function countUniqueLinks(targetNote: string, resolvedLinks: ResolvedLinks): number {
    let count = 0;
    
    for (const sourcePath in resolvedLinks) {
        const internalLinks = resolvedLinks[sourcePath];
        
        if (internalLinks && targetNote in internalLinks) {
            count++;
        }
    }
    return count
}

// counts how many total backlinks a note has
export function countTotalLinks(targetNote: string, resolvedLinks: ResolvedLinks): number {
    let count = 0;
    
    for (const sourcePath in resolvedLinks) {
        const internalLinks = resolvedLinks[sourcePath];
        
        if (internalLinks && targetNote in internalLinks) {
            count += internalLinks[targetNote] ?? 0;
        }
    }
    return count;
}