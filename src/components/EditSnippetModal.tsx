import { Button, Modal, Textarea, TextInput } from "@mantine/core";
import { defaultSnippet, type Snippet } from "@/types/snippet.ts";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

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
    initialValues: defaultSnippet,
    validate: {
      name: (value) => !value, // Not empty
      code: (value) => !value,
    },
  });
  const saveSnippet = (snippetInfo: Snippet) => {
    save(snippetInfo);
    close();
  };

  useEffect(() => {
    if (isOpen) {
      if (!!snippetInfo) {
        form.setInitialValues(
          // Deep clone
          JSON.parse(JSON.stringify(snippetInfo)),
        );
      } else {
        form.setInitialValues(defaultSnippet);
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

        <Textarea
          label="Code"
          withAsterisk
          autosize
          minRows={8}
          {...form.getInputProps("code")}
        />

        <Button mt="lg" type="submit">
          Save
        </Button>
      </form>
    </Modal>
  );
};

export default EditSnippetModal;
