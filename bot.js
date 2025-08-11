require('dotenv').config();
const { connectToDatabase } = require('./config/database');
const { generateResponse } = require('./services/openaiService');
const { bot, sendMessage } = require('./services/telegramService');
const logger = require('./utils/logger');

let db;

async function startBot() {
  db = await connectToDatabase();
  logger.log('Bot is running...');

  bot.on('message', handleMessage);
}

async function handleMessage(msg) {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  try {
    let response;

    if (userMessage.toLowerCase() === '/start') {
      response = "Hello! Are you looking for a health insurance plan? (Yes/No)";
    } else {
      response = await generateResponse(userMessage);
      
      if (response.toLowerCase().includes('yes') && userMessage.toLowerCase() === 'yes') {
        response += "\n\nGreat! Let's get some more information. What is your family size?";
      } else if (response.toLowerCase().includes('family size')) {
        response += "\n\nThank you. What is your household income?";
      } else if (response.toLowerCase().includes('household income')) {
        response += "\n\nGot it. Finally, what is your gender?";
      } else if (response.toLowerCase().includes('gender')) {
        response += "\n\nThank you for providing all the information. Based on your inputs, I recommend exploring the following health insurance plans...";
      }
    }

    await sendMessage(chatId, response);
    await saveConversation(chatId, userMessage, response);
  } catch (error) {
    logger.error(`Error processing message: ${error}`);
    await sendMessage(chatId, 'Sorry, there was an error processing your request.');
  }
}

async function saveConversation(userId, message, response) {
  try {
    const conversations = db.collection('conversations');
    await conversations.insertOne({
      userId,
      message,
      response,
      timestamp: new Date()
    });
  } catch (error) {
    logger.error(`Error saving conversation: ${error}`);
  }
}

startBot();

