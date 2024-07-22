import { Button, Modal, TagsInput, TextInput } from "@mantine/core";
import { defaultSnippet, type Snippet } from "@/types/snippet.ts";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import CodeHighlightEditor from "@/components/CodeHighlightEditor";

interface EditSnippetModalProps {
  isOpen: boolean;
  close: () => void;
  snippetInfo?: Snippet | null;
  save: (info: Snippet) => boolean;
}
const EditSnippetModal = ({
  isOpen,
  close,
  snippetInfo,
  save,
}: EditSnippetModalProps) => {
  const form = useForm<Snippet>({
    initialValues: defaultSnippet,
  });
  const saveSnippet = (snippetInfo: Snippet) => {
    if (save(snippetInfo)) {
      close();
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (!!snippetInfo) {
        form.setInitialValues(structuredClone(snippetInfo));
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
        <TextInput
          label="Name"
          required
          withAsterisk
          data-autofocus
          {...form.getInputProps("name")}
        />

        <TagsInput label="Tags" clearable {...form.getInputProps("tags")} />

        <CodeHighlightEditor
          value={form.getInputProps("code").value}
          onChange={form.getInputProps("code").onChange}
        />

        <Button mt="lg" type="submit">
          Save
        </Button>
      </form>
    </Modal>
  );
};

export default EditSnippetModal;
