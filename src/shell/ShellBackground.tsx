import { Flex, Image, rem, Title } from "@mantine/core";

const ShellBackground = () => (
  <Flex
    w="100%"
    h="100%"
    pos="absolute"
    justify="center"
    align="center"
    opacity="20%"
    style={{
      zIndex: -1,
      pointerEvents: "none",
    }}
    onContextMenu={(e) => {
      e.preventDefault();
    }}
  >
    <Flex gap="xl" align="center">
      <Image
        src="/icon.png"
        alt="Nekops"
        w={rem(256)}
        h={rem(256)}
        radius={rem(256)}
      />
      <Title fz={rem(128)}>Nekops</Title>
    </Flex>
  </Flex>
);

export default ShellBackground;
