import type { Snippet } from "@/types/snippet.ts";

export const searchSnippets = (searchInput: string, allSnippets: Snippet[]) =>
  searchInput === ""
    ? allSnippets
    : allSnippets.filter((snippet) => {
        for (const key of searchInput.toLowerCase().split(/\s+/)) {
          if (
            key.length > 0 &&
            (snippet.name.toLowerCase().includes(key) ||
              snippet.code.toLowerCase().includes(key) ||
              snippet.tags.findIndex((tag) => tag.toLowerCase() === key) != -1) // Tag full match
          ) {
            return true;
          }
        }
        return false;
      });
