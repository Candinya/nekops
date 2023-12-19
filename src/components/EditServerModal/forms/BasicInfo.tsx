import type { InputFormProps } from "../inputFormProps.ts";
import {
  ColorInput,
  Fieldset,
  Grid,
  TagsInput,
  Textarea,
  TextInput,
} from "@mantine/core";

interface BasicInfoFormProps extends InputFormProps {
  knownTags: string[];
}
const BasicInfoForm = ({ form, knownTags }: BasicInfoFormProps) => (
  <Fieldset legend="Basic Information">
    <Grid>
      <Grid.Col span={4}>
        <TextInput
          withAsterisk
          label="ID"
          placeholder="my.new.server"
          data-autofocus
          {...form.getInputProps("id")}
        />
      </Grid.Col>
      <Grid.Col span={8}>
        <TextInput
          label="Name"
          placeholder="My new server"
          {...form.getInputProps("name")}
        />
      </Grid.Col>
    </Grid>
    <Grid mt="md">
      <Grid.Col span={4}>
        <ColorInput
          label="Color"
          swatches={[
            "#2e2e2e",
            "#868e96",
            "#fa5252",
            "#e64980",
            "#be4bdb",
            "#7950f2",
            "#4c6ef5",
            "#228be6",
            "#15aabf",
            "#12b886",
            "#40c057",
            "#82c91e",
            "#fab005",
            "#fd7e14",
          ]}
          {...form.getInputProps("color")}
        />
      </Grid.Col>
      <Grid.Col span={8}>
        <TagsInput
          label="Tags"
          clearable
          data={knownTags}
          {...form.getInputProps("tags")}
        />
      </Grid.Col>
    </Grid>
    <Textarea
      mt="md"
      label="Comment"
      autosize
      minRows={6}
      placeholder="It's blazing fast! Love it."
      {...form.getInputProps("comment")}
    />
  </Fieldset>
);

export default BasicInfoForm;
