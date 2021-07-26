import React, { Component } from "react";
import { Box, Chip } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { withStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { postLatestReadMessage } from "../../store/utils/thunkCreators";
import { connect } from "react-redux";

const styles = {
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab",
    },
  },
  chip: {
    marginRight: "4px",
  },
};

class Chat extends Component {
  handleClick = async (conversation, user, otherUserLatestMessage) => {
    await this.props.setActiveChat(conversation.otherUser.username);

    // update my latest checked msg in this conv
    // to other user's latest created msg
    if (otherUserLatestMessage) {
      this.props.postLatestReadMessage({
        message: {
          userId: user.id,
          conversationId: conversation.id,
          messageId: otherUserLatestMessage.id,
        },
      });
    }
  };

  // find latest checked other's msg of mine
  findLatestReadMessage = (latestReadMessages, userId, conversationId) => {
    return latestReadMessages.find((message) => {
      return (
        message.userId === userId && message.conversationId === conversationId
      );
    });
  };

  // find other's latest created msg
  getOtherUserLatestMessage = (messages, userId) => {
    if (messages && userId) {
      const otherUserMessages = messages.filter(
        ({ senderId }) => senderId === userId
      );
      return otherUserMessages[otherUserMessages.length - 1];
    } else {
      return null;
    }
  };

  // get count of unread other's msg of me
  countUnreadMessages = (user, messages, latestReadMessage) => {
    if (messages && latestReadMessage) {
      const unreadMessages = messages.filter(
        (message) =>
          message.senderId !== user.id &&
          message.id > latestReadMessage.messageId
      );
      return unreadMessages.length;
    } else if (messages && !latestReadMessage) {
      const unreadMessages = messages.filter(
        (message) => message.senderId !== user.id
      );
      return unreadMessages.length;
    } else {
      return 0;
    }
  };

  render() {
    const { user, classes, conversation, latestReadMessages } = this.props;
    const otherUser = conversation.otherUser;
    // get other user's latest created msg in this conv
    const otherUserLatestMessage = this.getOtherUserLatestMessage(
      conversation.messages,
      otherUser.id
    );
    // get my latest checked msg in this conv
    const latestReadMessage = this.findLatestReadMessage(
      latestReadMessages,
      user.id,
      conversation.id
    );
    // get count of unread other's messages in this cov
    const unreadMessagesCount = this.countUnreadMessages(
      user,
      conversation.messages,
      latestReadMessage,
      otherUserLatestMessage
    );

    return (
      <Box
        onClick={() =>
          this.handleClick(
            this.props.conversation,
            user,
            otherUserLatestMessage
          )
        }
        className={classes.root}
      >
        <BadgeAvatar
          photoUrl={otherUser.photoUrl}
          username={otherUser.username}
          online={otherUser.online}
          sidebar={true}
        />
        <ChatContent
          conversation={this.props.conversation}
          unreadMessagesCount={unreadMessagesCount}
        />
        {unreadMessagesCount !== 0 && (
          <div className={classes.chip}>
            <Chip color="primary" label={unreadMessagesCount} />
          </div>
        )}
      </Box>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    latestReadMessages: state.latestReadMessage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
    postLatestReadMessage: (message) => {
      dispatch(postLatestReadMessage(message));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Chat));
