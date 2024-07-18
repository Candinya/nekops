import { Table } from "@mantine/core";
import type { Snippet } from "@/types/snippet.ts";

const SnippetsTableHead = () => (
  <Table.Tr>
    <Table.Th>Snippet Name</Table.Th>
    <Table.Th>Tags</Table.Th>
  </Table.Tr>
);

interface SnippetsTableRowProps {
  snippet: Snippet;
  show: () => void;
}
const SnippetsTableRow = ({ snippet, show }: SnippetsTableRowProps) => (
  <Table.Tr
    onClick={show}
    style={{
      cursor: "pointer",
    }}
  >
    <Table.Td>{snippet.name}</Table.Td>
    <Table.Td>{snippet.tags.join(", ")}</Table.Td>
  </Table.Tr>
);

interface SnippetsTableProps {
  snippets: Snippet[];
  show: (code: string) => void;
}
const SnippetsTable = ({ snippets, show }: SnippetsTableProps) => (
  <Table stickyHeader stickyHeaderOffset={-1} highlightOnHover withTableBorder>
    <Table.Thead
      style={{
        zIndex: 1,
      }}
    >
      <SnippetsTableHead />
    </Table.Thead>
    <Table.Tbody>
      {snippets.map((snippet) => (
        <SnippetsTableRow
          key={snippet.name}
          snippet={snippet}
          show={() => show(snippet.code)}
        />
      ))}
    </Table.Tbody>
    <Table.Caption>
      {snippets.length > 0
        ? `Total ${snippets.length} snippets.`
        : "Let's create a new snippet!"}
    </Table.Caption>
  </Table>
);

export default SnippetsTable;
