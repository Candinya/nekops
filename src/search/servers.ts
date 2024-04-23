import type { IP, Server } from "@/types/server.ts";

const matchIP = (key: string, ip: IP) =>
  ip.address.includes(key) ||
  ip.alias.includes(key) ||
  ip.comment.includes(key);

export const searchServers = (searchInput: string, allServers: Server[]) =>
  searchInput === ""
    ? allServers
    : allServers.filter((server) => {
        for (const key of searchInput.toLowerCase().split(/\s+/)) {
          if (
            key.length > 0 && // Is a valid search key
            // 1. ID contain
            (server.id.toLowerCase().includes(key) ||
              // 2. name contain
              server.name.toLowerCase().includes(key) ||
              // 3. comment contain
              server.comment.toLowerCase().includes(key) ||
              // 4. tags contain (full match)
              server.tags.some((tag) => tag.toLowerCase() === key) ||
              // 5.1. IP contain (public)
              server.network.public.some((pubip) => matchIP(key, pubip)) ||
              // 5.2. IP contain (private)
              server.network.private.some((privip) => matchIP(key, privip)))
          ) {
            return true;
          }
        }
        return false;
      });
