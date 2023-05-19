import {bot} from '../../utils/bot';
import {flow, pipe} from 'fp-ts/function';
import {array} from '../../utils/array';
import {option, predicate, string} from 'fp-ts';
import {pluck} from '../../utils/pluck';
import {
	addByUserIfThereIsNo,
	addUserCommand,
	isJoin,
	isLeft,
	joinUsers,
	lensSessionDataToUsers,
	removeUserCommand,
} from './model';

export const addSummonFunction = bot.effect(
	flow(
		bot.command('write', async (ctx) => {
			addByUserIfThereIsNo(ctx);
			const users = pipe(ctx.match.split(' '), array.filter(string.startsWith('@')));
			ctx.session = pipe(ctx.session, lensSessionDataToUsers({chatId: ctx.chat.id}).set(users));
			const writtenUsers = pipe(
				ctx.session.byChat,
				array.findFirst((so) => so.chatId === ctx.chat.id),
				option.map(pluck('users')),
				option.map(joinUsers),
				option.getOrElse(() => 'хрен пойми кого'),
			);
			return ctx.reply(`Принял.\nТеперь призываем ${writtenUsers}`, {
				reply_to_message_id: ctx.message?.message_id,
			});
		}),
		bot.command('add', (ctx) => {
			addByUserIfThereIsNo(ctx);
			if (ctx.message?.reply_to_message) {
				return addUserCommand(ctx, `@${ctx.message.reply_to_message.from?.username}`);
			}
			return addUserCommand(ctx);
		}),
		bot.command('remove', (ctx) => {
			addByUserIfThereIsNo(ctx);
			return removeUserCommand(ctx);
		}),
		bot.command('who', (ctx) => {
			addByUserIfThereIsNo(ctx);
			return pipe(
				ctx.session,
				lensSessionDataToUsers({chatId: ctx.chat.id}).getOption,
				option.filter(array.isNonEmpty),
				option.map(joinUsers),
				option.alt(() => pipe(ctx.session.toSummon, option.fromPredicate(predicate.not(string.isEmpty)))),
				option.map((users) => `В случае мобилизации призывать: ${users}`),
				option.getOrElse(() => 'Некого призывать'),
				(message) =>
					ctx.reply(message, {
						reply_to_message_id: ctx.message?.message_id,
					}),
			);
		}),
		bot.command('enlist', async (ctx) => {
			addByUserIfThereIsNo(ctx);
			return addUserCommand(ctx, `@${(await ctx.chatMembers.getChatMember(ctx.chat.id)).user.username}`);
		}),
		bot.hears(/@all/gm, (ctx) =>
			pipe(
				ctx.session,
				lensSessionDataToUsers({chatId: ctx.chat.id}).getOption,
				option.match(() => ctx.session.toSummon, joinUsers),
				(users) =>
					ctx.reply(`Посупил приказ мобилизовать ${users}. Родина мать зовет!`, {
						reply_to_message_id: ctx.message?.message_id,
					}),
			),
		),
		bot.on('chat_member', (ctx) => {
			const user = `@${ctx.update.chat_member.new_chat_member.user.username}`;
			if (isJoin(ctx)) {
				//TODO: fix it later
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return addUserCommand(ctx as any, user);
			}
			if (isLeft(ctx)) {
				//TODO: fix it later
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return removeUserCommand(ctx as any, user);
			}
		}),
	),
);
