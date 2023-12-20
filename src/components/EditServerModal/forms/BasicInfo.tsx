import type { InputFormProps } from "../inputFormProps.ts";
import {
  ColorInput,
  Fieldset,
  Grid,
  TagsInput,
  Textarea,
  TextInput,
  useMantineTheme,
} from "@mantine/core";

interface BasicInfoFormProps extends InputFormProps {
  knownTags: string[];
}
const BasicInfoForm = ({ form, knownTags }: BasicInfoFormProps) => {
  const theme = useMantineTheme();
  return (
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
              theme.colors.dark[6],
              theme.colors.gray[6],
              theme.colors.red[6],
              theme.colors.pink[6],
              theme.colors.grape[6],
              theme.colors.violet[6],
              theme.colors.indigo[6],
              theme.colors.blue[6],
              theme.colors.cyan[6],
              theme.colors.teal[6],
              theme.colors.green[6],
              theme.colors.lime[6],
              theme.colors.yellow[6],
              theme.colors.orange[6],
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
};

export default BasicInfoForm;
