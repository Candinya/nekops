import {
  Badge,
  Center,
  Divider,
  Flex,
  Image,
  Modal,
  rem,
  Text,
  Title,
} from "@mantine/core";
import { getVersion } from "@tauri-apps/api/app";
import { useEffect, useState } from "react";
import { IconHeartFilled } from "@tabler/icons-react";
import { open } from "@tauri-apps/plugin-shell";

interface AboutModalProps {
  isOpen: boolean;
  close: () => void;
}
const AboutModal = ({ isOpen, close }: AboutModalProps) => {
  const [version, setVersion] = useState("Loading...");

  const clickVersion = () => {
    open("https://nekops.app");
  };

  useEffect(() => {
    (async () => {
      setVersion(await getVersion());
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
            radius={rem(128)}
            style={{
              outline: "2px solid #62b6e7",
              outlineOffset: "4px",
            }}
          />
          <Flex direction="column" mb="md" align="center">
            <Title order={1}>Nekops</Title>
            <Text>Ops' now nyaing</Text>
            <Badge
              mt={rem(4)}
              style={{
                cursor: "pointer",
              }}
              onClick={clickVersion}
            >
              {version}
            </Badge>
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
      </Flex>
    </Modal>
  );
};

export default AboutModal;
