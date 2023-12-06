import { useDisclosure } from "@mantine/hooks";
import { Button } from "@mantine/core";
import EditServerModal from "@/components/editServerModal.tsx";
import { useRef } from "react";
import type { Server } from "@/types/server.ts";

const Servers = () => {
  const [
    isEditServerModalOpen,
    { open: openEditServerModal, close: closeEditServerModal },
  ] = useDisclosure(false);
  const isCreatingNew = useRef(false);

  const save = (info: Server) => {
    console.log(info);
  };

  return (
    <div>
      {/*Action Buttons*/}
      <Button onClick={openEditServerModal}>Open</Button>

      {/*Server Cards*/}

      {/*Edit Modal*/}
      <EditServerModal
        isOpen={isEditServerModalOpen}
        close={closeEditServerModal}
        isCreateNew={isCreatingNew.current}
        save={save}
      />
    </div>
  );
};

export default Servers;
