import React, { useMemo, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { useSelector, useDispatch } from "react-redux";
import { postLatestReadMessage } from "../../store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column",
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between",
  },
}));

const ActiveChat = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { user, conversations, activeConversation, latestReadMessage } =
    useSelector(
      ({ user, conversations, activeConversation, latestReadMessage }) => ({
        user,
        conversations,
        activeConversation,
        latestReadMessage,
      })
    );

  const conversation = useMemo(() => {
    if (conversations) {
      const conversation = conversations.find(
        (conversation) => conversation.otherUser.username === activeConversation
      );
      return conversation ? conversation : {};
    }
    return {};
  }, [activeConversation, conversations]);

  const latestReadMessages = useMemo(
    () => latestReadMessage || [],
    [latestReadMessage]
  );

  const getOtherUserLatestReadMessage = (
    latestReadMessages,
    conversation,
    user
  ) =>
    latestReadMessages.find(({ conversationId, userId }) => {
      return conversationId === conversation.id && userId !== user.id;
    });

  const getOtherUserLatestMessage = (conversation, user) => {
    if (conversation && conversation.messages) {
      const otherUserMessages = conversation.messages.filter(
        (message) => message.senderId !== user.id
      );
      return otherUserMessages[otherUserMessages.length - 1];
    }
    return null;
  };

  // get other user's latest checked msg
  // it is used for tracking the lastest checked msg of other user
  const otherUserLatestReadMessage = useMemo(
    () => getOtherUserLatestReadMessage(latestReadMessages, conversation, user),
    [conversation, latestReadMessages, user]
  );
  // get other user's latest created msg
  // it is used for updating my latest checked msg in this cov
  const otherUserLatestMessage = useMemo(
    () => getOtherUserLatestMessage(conversation, user),
    [conversation, user]
  );

  // when I click the active chat room, keep my latest checked message up-to-date
  const handleClick = useCallback(
    (conversation, user, otherUserLatestMessage) => {
      if (otherUserLatestMessage) {
        const { id, senderId } = otherUserLatestMessage;
        const message = {
          userId: user.id,
          conversationId: conversation.id,
          messageId: id,
        };
        dispatch(postLatestReadMessage(message, senderId));
      }
    },
    [dispatch]
  );

  return (
    <Box
      className={classes.root}
      onClick={() => handleClick(conversation, user, otherUserLatestMessage)}
    >
      {conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            <Messages
              messages={conversation.messages}
              otherUser={conversation.otherUser}
              userId={user.id}
              otherLatestReadMsgId={
                otherUserLatestReadMessage
                  ? otherUserLatestReadMessage.messageId
                  : -1
              }
            />
            <Input
              otherUser={conversation.otherUser}
              conversationId={conversation.id}
              user={user}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default ActiveChat;
