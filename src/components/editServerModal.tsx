import { Button, Group, Modal, Stepper, Title } from "@mantine/core";
import type { Server } from "@/types/server.ts";
import { useState } from "react";
import { useForm } from "@mantine/form";
import {
  IconBuildingStore,
  IconCircleCheck,
  IconCpu,
  IconKey,
  IconMapPin,
  IconNetwork,
  IconServerBolt,
} from "@tabler/icons-react";
import classes from "./editServerModal.module.css";

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
  const StepsCount = 6;

  const [activeStep, setActiveStep] = useState(0);
  const nextStep = () =>
    setActiveStep((current) => (current < StepsCount ? current + 1 : current));
  const prevStep = () =>
    setActiveStep((current) => (current > 0 ? current - 1 : current));

  const form = useForm({
    initialValues: {},

    validate: {},
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
              <Stepper.Step label="Basic" icon={<IconServerBolt />}>
                {Array(300)
                  .fill("")
                  .map((_, i) => (
                    <div key={i}>Basic Information form</div>
                  ))}
              </Stepper.Step>
              <Stepper.Step label="Provider" icon={<IconBuildingStore />}>
                Provider form
              </Stepper.Step>
              <Stepper.Step label="Location" icon={<IconMapPin />}>
                Location form
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
