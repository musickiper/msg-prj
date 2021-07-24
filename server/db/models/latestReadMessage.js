const Sequelize = require("sequelize");
const db = require("../db");

const LatestReadMessage = db.define("latestReadMessage", {
  conversationId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  messageId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

// find latestReadMessage given conv Id & user Id

LatestReadMessage.findLatestReadMessage = async function (
  conversationId,
  userId
) {
  const latestReadMessage = await LatestReadMessage.findOne({
    where: {
      userId: userId,
      conversationId: conversationId,
    },
  });

  // return latestReadMessage or null if it doesn't exist
  return latestReadMessage;
};

module.exports = LatestReadMessage;
