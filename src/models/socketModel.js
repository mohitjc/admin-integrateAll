import environment from "../environment";
import io from "socket.io-client";

const socketModel = io(environment.chat_api);
export default socketModel;
