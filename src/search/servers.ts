import type { Server } from "@/types/server.ts";

export const searchServers = (searchInput: string, allServers: Server[]) =>
  searchInput === ""
    ? allServers
    : allServers.filter((server) => {
        for (const key of searchInput.split(/\s+/)) {
          if (
            key.length > 0 &&
            (server.id.includes(key) ||
              server.name.includes(key) ||
              server.comment.includes(key) ||
              server.tags.includes(key)) // Tag full match
          ) {
            return true;
          }
        }
        return false;
      });
