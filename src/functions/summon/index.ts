import {bot} from '../../utils/bot';
import {flow, pipe} from 'fp-ts/function';
import {array} from '../../utils/array';
import {option, predicate, string} from 'fp-ts';
import {pluck} from '../../utils/pluck';
import {addByUserIfThereIsNo, addUser, hasThisUser, joinUsers, lensSessionDataToUsers, removeUser} from './model';

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
				option.map((users) => users.join(', ')),
				option.getOrElse(() => 'хрен пойми кого'),
			);
			return ctx.reply(`Принял.\nТеперь зовем ${writtenUsers}`, {
				reply_to_message_id: ctx.message?.message_id,
			});
		}),
		bot.command('add', (ctx) => {
			addByUserIfThereIsNo(ctx);
			if (hasThisUser(ctx)) {
				return ctx.reply(`${ctx.match} уже в призывном списке`);
			}
			ctx.session = addUser({chatId: ctx.chat.id, user: ctx.match})(ctx.session);
			return ctx.reply('Добавил');
		}),
		bot.command('remove', (ctx) => {
			addByUserIfThereIsNo(ctx);
			if (hasThisUser(ctx)) {
				return ctx.reply('Хм... ни знаю таких');
			}
			ctx.session = removeUser({chatId: ctx.chat.id, user: ctx.match})(ctx.session);
		}),
		bot.command('who', (ctx) =>
			pipe(
				ctx.session,
				lensSessionDataToUsers({chatId: ctx.chat.id}).getOption,
				option.map(joinUsers),
				option.alt(() => pipe(ctx.session.toSummon, option.fromPredicate(predicate.not(string.isEmpty)))),
				option.getOrElse(() => 'Некого призывать'),
				(users) =>
					ctx.reply(`В случае мобилизации призывать: ${users}`, {
						reply_to_message_id: ctx.message?.message_id,
					}),
			),
		),
		bot.hears(/@all/gm, (ctx) =>
			pipe(
				ctx.session,
				lensSessionDataToUsers({chatId: ctx.chat.id}).getOption,
				option.match(() => ctx.session.toSummon, joinUsers),
				(users) =>
					ctx.reply(`${users}, слыште`, {
						reply_to_message_id: ctx.message?.message_id,
					}),
			),
		),
	),
);
