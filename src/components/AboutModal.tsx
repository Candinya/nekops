import {
  Box,
  Center,
  Code,
  Divider,
  Flex,
  Image,
  Modal,
  rem,
  Text,
  Title,
} from "@mantine/core";
import { getTauriVersion, getVersion } from "@tauri-apps/api/app";
import { useEffect, useState } from "react";
import { IconHeartFilled } from "@tabler/icons-react";

interface AboutModalProps {
  isOpen: boolean;
  close: () => void;
}
const AboutModal = ({ isOpen, close }: AboutModalProps) => {
  const [version, setVersion] = useState("Loading...");
  const [tauriVersion, setTauriVersion] = useState("Loading...");

  useEffect(() => {
    (async () => {
      setVersion(await getVersion());
      setTauriVersion(await getTauriVersion());
    })();
  }, []);

  return (
    <Modal opened={isOpen} onClose={close} title="About Nekops" centered>
      <Flex py="sm" direction="column">
        <Flex direction="row" justify="space-around" align="center">
          <Image
            src="/icon.png"
            alt="Nekops"
            w={rem(128)}
            h={rem(128)}
            radius="lg"
          />
          <Flex direction="column" mb="md" align="center">
            <Title order={1}>Nekops</Title>
            <Text>Ops now nyaing</Text>
          </Flex>
        </Flex>
        <Divider my="lg" variant="dotted" label="About" />
        <Center>
          <Flex gap={rem(4)}>
            <Text>Crafted by @Candinya with</Text>
            <IconHeartFilled
              style={{
                color: "red",
              }}
            />
          </Flex>
        </Center>
        <Center>
          <Text>Commands all Nyawork servers</Text>
        </Center>
        <Divider my="lg" variant="dotted" label="Version info" />
        <Box>
          <Center>
            <Text>
              Version <Code>{version}</Code>
            </Text>
          </Center>
          <Center>
            <Text>
              Tauri Version <Code>{tauriVersion}</Code>
            </Text>
          </Center>
        </Box>
      </Flex>
    </Modal>
  );
};

export default AboutModal;
