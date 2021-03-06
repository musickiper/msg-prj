import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
} from "./store/conversations";
import { updateLatestReadMessage } from "./store/latestReadMessage";

const token = localStorage.getItem("messenger-token");

const socket = io(window.location.origin, {
  auth: {
    token,
  },
});

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", (data) => {
    store.dispatch(setNewMessage(data.message, data.sender));
  });
  socket.on("send-latest-read-message", (data) => {
    store.dispatch(updateLatestReadMessage(data.message));
  });
});

export default socket;
