import { CreateRectMessage } from "@common/network/messages/CreateRectMessage";
import * as Networker from "monorepo-networker";

export namespace NetworkMessages {
  export const registry = new Networker.MessageTypeRegistry();

  export const CREATE_RECT = registry.register(
    new CreateRectMessage("create-rect")
  );
}
