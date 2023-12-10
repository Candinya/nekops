import {
  ActionIcon,
  Button,
  Center,
  Group,
  Modal,
  Stepper,
  Title,
} from "@mantine/core";
import type { Server } from "@/types/server.ts";
import { useState } from "react";
import { useForm } from "@mantine/form";
import {
  IconBuildingStore,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheck,
  IconCpu,
  IconKey,
  IconNetwork,
  IconServerBolt,
} from "@tabler/icons-react";
import stepperClasses from "./stepper.module.css";
import { serverDefault } from "./serverDefault.ts";

import BasicInfoForm from "./forms/BasicInfo.tsx";
import ProviderAndLocationForm from "./forms/ProviderAndLocation.tsx";
import HardwareForm from "./forms/Hardware.tsx";
import NetworksForm from "./forms/Networks.tsx";

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
    initialValues: serverDefault,

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
              classNames={{
                steps: stepperClasses.steps,
                content: stepperClasses.content,
              }}
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
                <HardwareForm form={form} />
              </Stepper.Step>
              <Stepper.Step label="Networks" icon={<IconNetwork />}>
                <NetworksForm form={form} />
              </Stepper.Step>
              <Stepper.Step label="Access" icon={<IconKey />}>
                Access form
              </Stepper.Step>
              <Stepper.Completed>
                All done! Please review your settings:
                <Center>
                  <Group gap="md">
                    <Button type="submit">Confirm</Button>
                  </Group>
                </Center>
              </Stepper.Completed>
            </Stepper>

            <Group justify="center" mt="xl" pt="lg">
              <ActionIcon.Group>
                <ActionIcon
                  size="lg"
                  radius="lg"
                  aria-label="Back"
                  onClick={prevStep}
                  disabled={activeStep === 0}
                >
                  <IconChevronLeft />
                </ActionIcon>
                <ActionIcon
                  size="lg"
                  radius="lg"
                  aria-label="Next"
                  onClick={nextStep}
                  disabled={activeStep >= StepsCount}
                >
                  <IconChevronRight />
                </ActionIcon>
              </ActionIcon.Group>
              <ActionIcon
                size="lg"
                radius="lg"
                aria-label="Next"
                onClick={() => setActiveStep(StepsCount)}
                loading={activeStep >= StepsCount}
              >
                <IconCheck />
              </ActionIcon>
            </Group>
          </form>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default EditServerModal;
