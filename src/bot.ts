import {Bot, Context, MemorySessionStorage, session, SessionFlavor} from 'grammy';
import {chatMembers, ChatMembersFlavor} from '@grammyjs/chat-members';
import {ChatMember} from '@grammyjs/types';
import {freeStorage} from '@grammyjs/storage-free';

type BotContext = Context & ChatMembersFlavor & SessionFlavor<SessionData>;

const adapter = new MemorySessionStorage<ChatMember>();

interface SessionData {
	toSummon: string;
}

export const getBot = (token: string) => {
	const bot = new Bot<BotContext>(token);

	//prettier-ignore
	bot.use(
		chatMembers(adapter),
		session({initial: () => ({toSummon: ''}), storage: freeStorage<SessionData>(bot.token)})
	);
	bot.command('right', async (ctx) => {
		ctx.session.toSummon = ctx.message?.text || '';
		return ctx.reply('roger that');
	});

	bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'));
	bot.on('message', async (ctx) => {
		if (ctx.message.text?.includes('@all')) {
			//prettier-ignore
			return ctx.reply(
				`${ctx.session.toSummon}, you've been summoned`,
				{reply_to_message_id: ctx.message.message_id}
			);
		}
	});

	bot.catch((err) => console.error(err));
	bot.start({allowed_updates: ['chat_member', 'message']}).then();
};
