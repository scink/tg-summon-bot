import {Lens, Optional} from 'monocle-ts';
import {BotContext, SessionData, SummonObject} from '../../plugins';
import {eq, number, option, string} from 'fp-ts';
import {array} from '../../utils/array';
import {reader} from '../../utils/reader';
import {flow, pipe} from 'fp-ts/function';
import {curry} from '../../utils/curry';
import {Eq} from 'fp-ts/Eq';
import {pluck} from '../../utils/pluck';
import {CommandContext} from 'grammy';
import {Endomorphism} from 'fp-ts/Endomorphism';
import {Reader} from 'fp-ts/Reader';
import {Func} from '../../utils/type';
import {Predicate} from 'fp-ts/Predicate';
import {isNotNullable} from '@devexperts/utils/dist/object/object';

//region types
interface WithUser {
	user: string;
}
interface WithChatId {
	chatId: number;
}
//endregion
//region eq
const eqSummonObject: Eq<SummonObject> = eq.contramap<number, SummonObject>(pluck('chatId'))(number.Eq);
//endregion
//region lens simple
const lensSessionDataToSummonObjects = Lens.fromProp<SessionData>()('byChat');
export const lensSummonObjectsToSummonObject = (chatId: number) =>
	new Optional<SessionData['byChat'], SummonObject>(
		flow(
			array.findFirst((a) => a.chatId === chatId),
			option.alt(() => option.some<SummonObject>({chatId, users: []})),
		),
		curry(array.upsertEq)(eqSummonObject),
	);
const lensSummonObjectToUsers = Lens.fromProp<SummonObject>()('users');
export const lensUsersToUser = (user: string) =>
	new Optional<SummonObject['users'], string>(
		array.findFirst((a) => a === user),
		(a) => array.upsert((_a) => _a === a, a),
	);
//endregion
//region lens complex
export const lensSessionDataToUsers = ({chatId}: WithChatId) =>
	lensSessionDataToSummonObjects
		.asOptional()
		.compose(lensSummonObjectsToSummonObject(chatId))
		.compose(lensSummonObjectToUsers.asOptional());
export const lensSessionDataToUser = reader.combine(lensSessionDataToUsers, reader.ask<WithUser>(), (lens, {user}) =>
	lens.compose(lensUsersToUser(user)),
);

//endregion
//region action
export const writeUsers: Reader<WithChatId, Func<Array<string>, Endomorphism<SessionData>>> = pipe(
	lensSessionDataToUsers,
	reader.map((lens) => (users: Array<string>) => lens.set(users)),
);
export const addUser: Reader<WithUser & WithChatId, Endomorphism<SessionData>> = reader.combine(
	lensSessionDataToUsers,
	reader.ask<WithUser>(),
	(lens, {user}) => lens.modify(flow(array.append(user), array.uniq(string.Eq))),
);
export const removeUser: Reader<WithUser & WithChatId, Endomorphism<SessionData>> = reader.combine(
	lensSessionDataToUsers,
	reader.ask<WithUser>(),
	(lens, {user}) =>
		(sd: SessionData) =>
			pipe(sd, lens.modify(array.removeFirst((a) => a === user))),
);
//endregion
//region predicates
const hasUser: Reader<WithUser & WithChatId, Predicate<SessionData>> = reader.combine(
	lensSessionDataToUser,
	reader.ask<WithUser>(),
	(lens, {user}) => flow(lens.getOption, option.isSome),
);
export const hasThisUser = (ctx: CommandContext<BotContext>) =>
	hasUser({chatId: ctx.chat.id, user: ctx.match})(ctx.session);
//endregion
export const addByUserIfThereIsNo = (ctx: CommandContext<BotContext>) => {
	if (!isNotNullable(ctx.session.byChat)) {
		ctx.session.byChat = [];
	}
};
export const joinUsers = (users: Array<string>): string => users.join(', ');
export const addUserCommand = (ctx: CommandContext<BotContext>, user: string = ctx.match) => {
	if (hasThisUser(ctx)) {
		return ctx.reply(`${user} уже в призывном списке`);
	}
	ctx.session = addUser({chatId: ctx.chat.id, user})(ctx.session);
	return ctx.reply('Добавил');
};
