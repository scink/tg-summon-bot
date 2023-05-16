import {bot} from '../utils/bot/bot';
import {flow} from 'fp-ts/function';

export const addSummonFunction = bot.effect(
	flow(
		bot.command('write', async (ctx) => {
			ctx.session.toSummon = ctx.match;
			return ctx.reply('Принял', {reply_to_message_id: ctx.message?.message_id});
		}),
		bot.hears(/@all/gm, (ctx) =>
			ctx.reply(`${ctx.session.toSummon}, слыште`, {
				reply_to_message_id: ctx.message?.message_id,
			})
		)
	)
);
