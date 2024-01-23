import type { Server } from "@/types/server.ts";

export const searchServers = (searchInput: string, allServers: Server[]) =>
  searchInput === ""
    ? allServers
    : allServers.filter((server) => {
        for (const key of searchInput.toLowerCase().split(/\s+/)) {
          if (
            key.length > 0 &&
            (server.id.toLowerCase().includes(key) ||
              server.name.toLowerCase().includes(key) ||
              server.comment.toLowerCase().includes(key) ||
              server.tags.findIndex((tag) => tag.toLowerCase() === key) != -1) // Tag full match
          ) {
            return true;
          }
        }
        return false;
      });
