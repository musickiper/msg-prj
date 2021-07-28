import { updateLatestReadMsgOfStore } from "./utils/reducerFunctions";

// ACTIONS

const GET_LATEST_READ_MESSAGES = "GET_LATEST_READ_MESSAGES";
const UPDATE_LATEST_READ_MESSAGE = "UPDATE_LATEST_READ_MESSAGE";

// ACTION CREATORS

// get all latestReadMessages
export const gotLatestReadMessages = (latestReadMessages) => {
  return {
    type: GET_LATEST_READ_MESSAGES,
    latestReadMessages,
  };
};

// update latestReadMessage
export const updateLatestReadMessage = (latestReadMessage) => {
  return {
    type: UPDATE_LATEST_READ_MESSAGE,
    payload: { latestReadMessage },
  };
};

// REDUCER

const reducer = (state = [], action) => {
  switch (action.type) {
    case GET_LATEST_READ_MESSAGES:
      return action.latestReadMessages;
    case UPDATE_LATEST_READ_MESSAGE:
      return updateLatestReadMsgOfStore(
        state,
        action.payload.latestReadMessage
      );
    default:
      return state;
  }
};

export default reducer;
