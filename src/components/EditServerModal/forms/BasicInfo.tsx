import type { InputFormProps } from "../inputFormProps.ts";
import {
  ColorInput,
  Fieldset,
  Grid,
  TagsInput,
  Textarea,
  TextInput,
} from "@mantine/core";

const BasicInfoForm = ({ form }: InputFormProps) => (
  <Fieldset legend="Basic Information">
    <Grid>
      <Grid.Col span={4}>
        <TextInput
          withAsterisk
          label="ID"
          placeholder="my.new.server"
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
        <ColorInput label="Color" {...form.getInputProps("color")} />
      </Grid.Col>
      <Grid.Col span={8}>
        <TagsInput label="Tags" {...form.getInputProps("tags")} />
      </Grid.Col>
    </Grid>
    <Textarea
      mt="md"
      label="Note"
      autosize
      minRows={6}
      placeholder="It's blazing fast! Love it."
      {...form.getInputProps("note")}
    />
  </Fieldset>
);

export default BasicInfoForm;
