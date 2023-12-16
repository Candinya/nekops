import type { Snippet } from "@/types/snippet.ts";

export const searchSnippets = (searchInput: string, allSnippets: Snippet[]) =>
  searchInput === ""
    ? allSnippets
    : allSnippets.filter((snippet) => {
        for (const key of searchInput.split(/\s+/)) {
          if (
            key.length > 0 &&
            (snippet.name.includes(key) || snippet.code.includes(key))
          ) {
            return true;
          }
        }
        return false;
      });
