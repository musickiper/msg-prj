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

module.exports = LatestReadMessage;
