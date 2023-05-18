import {array} from '../array';

const arr = [1, 2, 3];
describe('array.ts', () => {
	describe('removeFirst', () => {
		it('should return array without removed item', () => {
			const a = array.removeFirst((a) => a === 1)(arr);
			expect(a).toStrictEqual([2, 3]);
		});
		it('should return full array it there is no item to delete', () => {
			const a = array.removeFirst((a) => a === 4)(arr);
			expect(a).toStrictEqual([1, 2, 3]);
		});
	});
});
