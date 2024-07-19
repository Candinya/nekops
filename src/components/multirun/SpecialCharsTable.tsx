import { Table } from "@mantine/core";
import { SpecialCharsMapping } from "@/components/multirun/specialCharsMapping.ts";

interface SpecialCharsTableProps {
  append: (data: string) => void;
}
const SpecialCharsTable = ({ append }: SpecialCharsTableProps) => (
  <Table highlightOnHover>
    <Table.Thead>
      <Table.Tr>
        <Table.Th>Char</Table.Th>
        <Table.Th>Description</Table.Th>
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      {SpecialCharsMapping.map((char) => (
        <Table.Tr
          onClick={() => append(char.key)}
          style={{
            cursor: "pointer",
          }}
        >
          <Table.Td>{JSON.stringify(char.key).slice(1, -1)}</Table.Td>
          <Table.Td>{char.description}</Table.Td>
        </Table.Tr>
      ))}
    </Table.Tbody>
  </Table>
);

export default SpecialCharsTable;
