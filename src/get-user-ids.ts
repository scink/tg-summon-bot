import TelegramBot, {Message} from 'node-telegram-bot-api';

const bot = new TelegramBot('');

bot.onText(/\/history/, (msg: Message) => {
	// Получаем chatId из объекта Message
	const chatId = msg.chat.id;

	// Получаем историю сообщений для указанного chatId
	bot.getChatHistory(chatId, {limit: 100}).then((messages) => {
		// Выводим все сообщения в консоль
		console.log(messages);
	});
});
