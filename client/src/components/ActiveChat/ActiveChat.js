import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect } from "react-redux";
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

const ActiveChat = (props) => {
  const classes = useStyles();
  const { user, postLatestReadMessage } = props;
  const conversation = props.conversation || {};
  const latestReadMessages = props.latestReadMessage || [];

  // get other user's latest checked msg
  // it is used for tracking the lastest checked msg of other user
  const otherUserLatestReadMessage = getOtherUserLatestReadMessage(
    latestReadMessages,
    conversation,
    user
  );
  // get other user's latest created msg
  // it is used for updating my latest checked msg in this cov
  const otherUserLatestMessage = getOtherUserLatestMessage(conversation, user);

  // when I click the active chat room, keep my latest checked message up-to-date
  const handleClick = (conversation, user, otherUserLatestMessage) => {
    if (otherUserLatestMessage) {
      postLatestReadMessage({
        message: {
          userId: user.id,
          conversationId: conversation.id,
          messageId: otherUserLatestMessage.id,
        },
      });
    }
  };

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

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversation:
      state.conversations &&
      state.conversations.find(
        (conversation) =>
          conversation.otherUser.username === state.activeConversation
      ),
    latestReadMessage: state.latestReadMessage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    postLatestReadMessage: (message) => {
      dispatch(postLatestReadMessage(message));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveChat);
