const TelegramBot = require("node-telegram-bot-api");

const BOT_TOKEN = "8844700938:AAH4RWntbMgjLxXhTj1wnBXM-GvwfEF4YTI";
const OWNER_CHAT_ID = 1727508982;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Store mapping between forwarded message and original user
const replyMap = new Map();

// User → Owner
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  // Ignore messages from owner
  if (chatId === OWNER_CHAT_ID) return;

  // Forward user message
  const forwarded = await bot.forwardMessage(
    OWNER_CHAT_ID,
    chatId,
    msg.message_id
  );

  // Save relation
  replyMap.set(forwarded.message_id, chatId);

  // Optional auto-reply
//   await bot.sendMessage(
//     chatId,
//     "Thanks for contacting us. We received your message."
//   );
});

// Owner → User
bot.on("message", async (msg) => {
  if (msg.chat.id !== OWNER_CHAT_ID) return;

  if (!msg.reply_to_message) return;

  const userId = replyMap.get(
    msg.reply_to_message.message_id
  );

  if (!userId) return;

  await bot.sendMessage(userId, msg.text);
});