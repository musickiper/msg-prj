const router = require("express").Router();
const { Op } = require("sequelize");
const { LatestReadMessage, Conversation } = require("../../db/models");

// get all latestReadMessages for a user
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;

    // get IDs of all conversations user is in.
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
    });
    const convIds = conversations.map((conv) => conv.id);

    // get all latestReadMessages of all conversations gotten above
    const latestReadMessages = await LatestReadMessage.findAll({
      where: {
        conversationId: {
          [Op.in]: convIds,
        },
      },
    });
    res.json(latestReadMessages);
  } catch (error) {
    next(error);
  }
});

// update or create latestReadMessage
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const { messageId, conversationId } = req.body.message;

    let latestReadMessage = await LatestReadMessage.findLatestReadMessage(
      conversationId,
      userId
    );

    if (!latestReadMessage) {
      // create latestReadMessage
      latestReadMessage = await LatestReadMessage.create({
        conversationId,
        userId,
        messageId: -1,
      });
    }
    latestReadMessage.messageId = messageId;
    await latestReadMessage.save();

    return res.json(latestReadMessage);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
