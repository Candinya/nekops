import { Button, Group, Modal, Stepper, Title } from "@mantine/core";
import type { Server } from "@/types/server.ts";
import { useState } from "react";
import { useForm } from "@mantine/form";
import {
  IconBuildingStore,
  IconCircleCheck,
  IconCpu,
  IconKey,
  IconNetwork,
  IconServerBolt,
} from "@tabler/icons-react";
import stepperClasses from "./stepper.module.css";
import { serverDefault } from "./serverDefault.ts";

import BasicInfoForm from "./forms/basicInfo";
import ProviderAndLocationForm from "./forms/providerAndLocation";

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
