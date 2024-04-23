import type { Snippet } from "@/types/snippet.ts";

export const searchSnippets = (searchInput: string, allSnippets: Snippet[]) =>
  searchInput === ""
    ? allSnippets
    : allSnippets.filter((snippet) => {
        for (const key of searchInput.toLowerCase().split(/\s+/)) {
          if (
            key.length > 0 && // Is a valid search key
            // 1. name contain
            (snippet.name.toLowerCase().includes(key) ||
              // 2. code contain
              snippet.code.toLowerCase().includes(key) ||
              // 4. tags contain (full match)
              snippet.tags.some((tag) => tag.toLowerCase() === key)) // Tag full match
          ) {
            return true;
          }
        }
        return false;
      });
