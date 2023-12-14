import { Button, Modal, TextInput } from "@mantine/core";
import type { Snippet } from "@/types/snippet.ts";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

const snippetDefault = {
  name: "",
  code: "",
};

interface EditSnippetModalProps {
  isOpen: boolean;
  close: () => void;
  snippetInfo?: Snippet;
  save: (info: Snippet) => void;
}
const EditSnippetModal = ({
  isOpen,
  close,
  snippetInfo,
  save,
}: EditSnippetModalProps) => {
  const form = useForm<Snippet>({
    initialValues: snippetDefault,
    validate: {
      name: (value) => !value, // Not empty
    },
  });
  const saveSnippet = (snippetInfo: Snippet) => {
    save(snippetInfo);
    close();
  };

  useEffect(() => {
    if (isOpen) {
      if (!!snippetInfo) {
        form.setInitialValues(snippetInfo);
      } else {
        form.setInitialValues(snippetDefault);
      }
      form.reset();
    }
  }, [isOpen]);

  return (
    <Modal
      title={
        snippetInfo ? `Edit snippet ${snippetInfo.name}` : "Add new snippet"
      }
      opened={isOpen}
      onClose={close}
      size="lg"
    >
      <form onSubmit={form.onSubmit(saveSnippet)}>
        <TextInput label="Name" withAsterisk {...form.getInputProps("name")} />

        <Button mt="lg" type="submit">
          Save
        </Button>
      </form>
    </Modal>
  );
};

export default EditSnippetModal;
