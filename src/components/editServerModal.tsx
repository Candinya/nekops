import {
  Autocomplete,
  Button,
  ColorInput,
  Fieldset,
  Flex,
  Grid,
  Group,
  Modal,
  NumberInput,
  SegmentedControl,
  Select,
  Stepper,
  TagsInput,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import type { Server } from "@/types/server.ts";
import { useState } from "react";
import { useForm, type UseFormReturnType } from "@mantine/form";
import {
  IconBuildingStore,
  IconCircleCheck,
  IconCpu,
  IconCurrencyDollar,
  IconKey,
  IconNetwork,
  IconServerBolt,
} from "@tabler/icons-react";
import classes from "./editServerModal.module.css";

interface InputFormProps {
  form: UseFormReturnType<Server, (values: Server) => Server>;
}

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

const ProviderAndLocationForm = ({ form }: InputFormProps) => (
  <>
    <Fieldset legend="Provider">
      <Grid>
        <Grid.Col span={9}>
          <Autocomplete
            label="Provider"
            placeholder="Pick one or enter new"
            data={["A", "B"]} // TODO
            {...form.getInputProps("provider.provider")}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <Flex gap="md">
            <Flex direction="column">
              <Text size="sm" fw={500} mb={3}>
                Type
              </Text>
              <SegmentedControl
                data={["VPS", "DS"]}
                {...form.getInputProps("provider.type")}
              />
            </Flex>
            <NumberInput
              label="Monthly Price"
              leftSection={<IconCurrencyDollar />}
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              style={{
                flexGrow: 1,
              }}
              {...form.getInputProps("provider.price")}
            />
          </Flex>
        </Grid.Col>
      </Grid>
      <TextInput
        mt="md"
        label="Product"
        {...form.getInputProps("provider.product")}
      />
    </Fieldset>

    <Fieldset mt="lg" legend="Location">
      <Grid>
        <Grid.Col span={2}>
          <Select
            label="Region"
            data={["A", "B"]}
            searchable
            nothingFoundMessage="No such region"
            {...form.getInputProps("location.region")}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Datacenter"
            {...form.getInputProps("location.datacenter")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Host System"
            {...form.getInputProps("location.host_system")}
          />
        </Grid.Col>
      </Grid>
    </Fieldset>
  </>
);

interface EditServerModalProps {
  isOpen: boolean;
  close: () => void;
  isCreateNew: boolean;
  save: (info: Server) => void;
}
const EditServerModal = ({
  isOpen,
  close,
  isCreateNew,
}: EditServerModalProps) => {
  const StepsCount = 5;

  const [activeStep, setActiveStep] = useState(0);
  const nextStep = () =>
    setActiveStep((current) => (current < StepsCount ? current + 1 : current));
  const prevStep = () =>
    setActiveStep((current) => (current > 0 ? current - 1 : current));

  const form = useForm<Server>({
    initialValues: {
      id: "",
      name: "",
      note: "",
      tags: [],
      // icon: "",
      color: "#62b6e7",

      provider: {
        provider: "",
        type: "VPS",
        product: "",
        price: 0,
      },

      location: {
        region: "",
        datacenter: "",
        host_system: "",
      },

      hardware: {
        cpu: {
          manufacturer: "Intel",
          model: "",
          count: 1,
          core_count: 1,
          thread_count: 1,
          base_frequency: 1,
        },
        memory: {
          generation: "DDR4",
          ecc: false,
          size: 1,
          frequency: 2400,
        },
        disk: [],
      },

      network: {
        public: {
          ipv4: [],
          ipv6: [],
        },
        private: {
          ip: "",
        },
      },

      access: {
        regular: {
          port: 22,
          user: "root",
          private: false,
        },
        emergency: {
          root_password: "",
          method: "VNC",
          address: "",
          username: "",
          password: "",
        },
      },
    },

    validate: {},

    validateInputOnBlur: true,
  });

  return (
    <Modal.Root
      opened={isOpen}
      onClose={close}
      fullScreen
      radius={0}
      transitionProps={{ transition: "fade", duration: 200 }}
    >
      {/*<Modal.Overlay />*/}
      <Modal.Content
        w="100%"
        display="flex"
        style={{
          flexDirection: "column",
        }}
      >
        <Modal.Header>
          <Title order={1} size="h3">
            {isCreateNew ? "Add new server" : "Edit server"}
          </Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body h="100%">
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
            onSubmit={form.onSubmit((values) => console.log(values))}
          >
            <Stepper
              active={activeStep}
              onStepClick={setActiveStep}
              completedIcon={<IconCircleCheck />}
              style={{
                flexGrow: 1,
                height: 0,
              }}
              classNames={{ steps: classes.steps, content: classes.content }}
            >
              <Stepper.Step label="Basic Info" icon={<IconServerBolt />}>
                <BasicInfoForm form={form} />
              </Stepper.Step>
              <Stepper.Step
                label="Provider & Location"
                icon={<IconBuildingStore />}
              >
                <ProviderAndLocationForm form={form} />
              </Stepper.Step>
              <Stepper.Step label="Hardware" icon={<IconCpu />}>
                Hardware form
              </Stepper.Step>
              <Stepper.Step label="Networks" icon={<IconNetwork />}>
                Network form
              </Stepper.Step>
              <Stepper.Step label="Access" icon={<IconKey />}>
                Access form
              </Stepper.Step>
              <Stepper.Completed>
                All done! Please review your settings:
              </Stepper.Completed>
            </Stepper>

            <Group justify="center" mt="xl" pt="1rem">
              <Button
                variant="default"
                onClick={prevStep}
                disabled={activeStep === 0}
              >
                Back
              </Button>
              <Button
                onClick={nextStep}
                type={activeStep < StepsCount ? "button" : "submit"}
              >
                {activeStep < StepsCount ? "Next" : "Confirm"}
              </Button>
            </Group>
          </form>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default EditServerModal;
