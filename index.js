const TelegramBot = require('node-telegram-bot-api');
const { log } = require('console');

const token = '7195144231:AAGAYrR-hKdQPRi1RMiS6d3lUR0rD0o0-dM';
const bot = new TelegramBot(token, { polling: true });


const userStates = {};
let isWaitingForSelection = false; 


function sendKeyboard(chatId) {
  const keyboard = getKeyboard();
  const options = {
    reply_markup: {
      inline_keyboard: keyboard,
    },
  };

  if (!isWaitingForSelection) {
    isWaitingForSelection = true; 
    bot.sendMessage(chatId, 'Выберите действие:', options).then(() => {
      waitForButtonSelection(chatId);
    });
  }
}


function getKeyboard() {
  return [
    [
      { text: 'Кнопка 1', callback_data: 'btn_1' },
      { text: 'Кнопка 2', callback_data: 'btn_2' },
      { text: 'Кнопка 3', callback_data: 'btn_3' },
    ],
  ];
}


function waitForButtonSelection(chatId) {
  bot.on('callback_query', (query) => {
    if (query.message.chat.id === chatId) {
      const buttonId = query.data;
      const buttonText = getButtonText(buttonId);

      bot.sendMessage(chatId, `Вы выбрали кнопку: ${buttonText}`);


      isWaitingForSelection = false; 
      bot.off('callback_query'); 
    }
  });
}


function getButtonText(buttonId) {
  switch (buttonId) {
    case 'btn_1':
      return 'Кнопка 1';
    case 'btn_2':
      return 'Кнопка 2';
    case 'btn_3':
      return 'Кнопка 3';
    default:
      return 'Неизвестная кнопка';
  }
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  sendKeyboard(chatId);
});
