import {SessionData} from '../../plugins';
import {
	addUser,
	lensSessionDataToUser,
	lensSessionDataToUsers,
	lensSummonObjectsToSummonObject,
	lensUsersToUser,
	removeUser,
	writeUsers,
} from './model';
import {option} from 'fp-ts';

const sessionData: SessionData = {
	toSummon: '',
	byChat: [
		{chatId: 0, users: []},
		{chatId: 1, users: ['@qwe']},
		{chatId: 2, users: ['@asd', '@zxc']},
		{chatId: 3, users: ['@wer', '@sdf', '@xcv']},
	],
};
describe('summon model', () => {
	describe('lensSummonObjectsToSummonObject', () => {
		it('should return existing object', () => {
			const a = lensSummonObjectsToSummonObject(1).getOption(sessionData.byChat);
			expect(option.toUndefined(a)).toBe(sessionData.byChat[1]);
		});
		it('should add object if it does not exist', () => {
			const a = option.toUndefined(lensSummonObjectsToSummonObject(4).getOption(sessionData.byChat));
			expect(a).toStrictEqual({chatId: 4, users: []});
		});
	});
	describe('lensUsersToUser', () => {
		const users = sessionData.byChat[1].users;
		it('should return existing user', () => {
			const a = option.toUndefined(lensUsersToUser('@qwe').getOption(users));
			expect(a).toBe('@qwe');
		});
		it('should not return user if there is no such one', () => {
			const a = option.toUndefined(lensUsersToUser('@qaz').getOption(users));
			expect(a).toBeUndefined();
		});
	});
	describe('lensSessionDataToUsers', () => {
		it('should return existing users array', () => {
			const a = option.toUndefined(lensSessionDataToUsers({chatId: 1}).getOption(sessionData));
			expect(a).toStrictEqual(['@qwe']);
		});
		it('should create object and return its empty users array', () => {
			const a = option.toUndefined(lensSessionDataToUsers({chatId: 4}).getOption(sessionData));
			expect(a).toStrictEqual([]);
		});
	});
	describe('lensSessionDataToUser', () => {
		it('should return existing user', () => {
			const a = option.toUndefined(lensSessionDataToUser({chatId: 1, user: '@qwe'}).getOption(sessionData));
			expect(a).toBe('@qwe');
		});
		it('should not return user if there is no such one', () => {
			const a = option.toUndefined(lensSessionDataToUser({chatId: 1, user: '@qaz'}).getOption(sessionData));
			expect(a).toBeUndefined();
		});
	});
	describe('writeUsers', () => {
		const users = ['@cvb', '@dfg'];
		it('should rewrite users if there is a summon object', () => {
			const a = writeUsers({chatId: 0})(users)(sessionData);
			expect(a.byChat[0].users).toStrictEqual(users);
		});
		it('should create object and write users if there is no such object', () => {
			const a = writeUsers({chatId: 4})(users)(sessionData);
			expect(a.byChat[4].users).toStrictEqual(users);
		});
	});
	describe('addUser', () => {
		it('should add user to the end of users array', () => {
			const user = '@fff';
			const a = addUser({chatId: 1, user})(sessionData);
			expect(a.byChat[1].users).toStrictEqual(['@qwe', user]);
		});
		it('should not add user if there is one in array', () => {
			const a = addUser({chatId: 2, user: '@asd'})(sessionData);
			expect(a.byChat[2].users).toStrictEqual(['@asd', '@zxc']);
		});
		it('should create object and add user to array', () => {
			const a = addUser({chatId: 4, user: '@fff'})(sessionData);
			expect(a.byChat[4].users).toStrictEqual(['@fff']);
		});
	});
	describe('removeUser', () => {
		it('should remove user from array when there is one', () => {
			const a = removeUser({chatId: 1, user: '@qwe'})(sessionData);
			expect(a.byChat[1].users).toStrictEqual([]);
			const b = removeUser({chatId: 2, user: '@asd'})(sessionData);
			expect(b.byChat[2].users).toStrictEqual(['@zxc']);
		});
		it('should not do anything if object exists but no such user', () => {
			const a = removeUser({chatId: 0, user: '@qwe'})(sessionData);
			expect(a.byChat[0].users).toStrictEqual([]);
			const b = removeUser({chatId: 1, user: '@qaz'})(sessionData);
			expect(b.byChat[1].users).toStrictEqual(['@qwe']);
		});
		it('should do nothing if there is no such object', () => {
			const a = removeUser({chatId: 4, user: '@qaz'})(sessionData);
			expect(a.byChat[4]).toBeUndefined();
		});
	});
});
