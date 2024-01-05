import { Box, Flex } from "@mantine/core";
import { useRef } from "react";
import type { Server } from "@/types/server.ts";
import { useVirtualizer } from "@tanstack/react-virtual";
import ServerCard from "@/components/ServerCard.tsx";

interface ServerCardsVirtualScrollProps {
  servers: Server[];
  onClicked: (server: Server) => void;
}
const ServerCardsVirtualScroll = ({
  servers,
  onClicked,
}: ServerCardsVirtualScrollProps) => {
  // Virtual scroll
  const virtualScrollParentRef = useRef<HTMLDivElement | null>(null);
  const rowVirtualizer = useVirtualizer({
    count: servers.length,
    getScrollElement: () => virtualScrollParentRef.current,
    estimateSize: () => 12 * 16,
  });

  const items = rowVirtualizer.getVirtualItems();

  return (
    <div
      style={{
        overflow: "auto",
      }}
      ref={virtualScrollParentRef}
    >
      <Flex
        direction="column"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${items[0]?.start || 0}px)`,
          }}
        >
          {items.map((virtualItem, index) => (
            <Box
              key={virtualItem.key}
              ref={rowVirtualizer.measureElement}
              mx="md"
              mb="md"
              data-index={index}
            >
              <ServerCard
                server={servers[virtualItem.index]}
                onClick={() => onClicked(servers[virtualItem.index])}
              />
            </Box>
          ))}
        </div>
      </Flex>
    </div>
  );
};

export default ServerCardsVirtualScroll;
