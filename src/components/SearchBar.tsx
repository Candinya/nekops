import { IconSearch } from "@tabler/icons-react";
import { CloseButton, Loader, TextInput } from "@mantine/core";

interface SearchBarProps {
  placeholder: string;
  searchInput: string;
  setSearchInput: (state: string) => void;
  debouncedSearchInput: string;
}
const SearchBar = ({
  placeholder,
  searchInput,
  setSearchInput,
  debouncedSearchInput,
}: SearchBarProps) => (
  <TextInput
    leftSection={<IconSearch size={18} />}
    rightSection={
      (searchInput !== "" || debouncedSearchInput !== "") &&
      (searchInput !== debouncedSearchInput ? (
        <Loader size="xs" />
      ) : (
        <CloseButton onClick={() => setSearchInput("")} />
      ))
    }
    placeholder={placeholder}
    style={{
      flexGrow: 1,
    }}
    value={searchInput}
    onChange={(ev) => setSearchInput(ev.currentTarget.value)}
  />
);

export default SearchBar;
