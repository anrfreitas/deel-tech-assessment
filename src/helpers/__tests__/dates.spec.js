const dateHelper = require('../dates');

describe('Test Date Helper', () => {
    it('should return true when passing only one digit', () => {
        expect(dateHelper.isValidDate(1)).toBe(true);
    });

    it('should return true when passing two digits', () => {
        expect(dateHelper.isValidDate(22)).toBe(true);
    });

    it('should return true when passing three digits', () => {
        expect(dateHelper.isValidDate(222)).toBe(true);
    });

    it('should return true when passing four digits', () => {
        expect(dateHelper.isValidDate(2222)).toBe(true);
    });

    it('should return false on invalid date', () => {
        expect(dateHelper.isValidDate('a')).toBe(false);
    });

    it('should return converted date correctly (one digit)', () => {
        const convertedDate = dateHelper.getDate('2');
        expect(convertedDate.getFullYear()).toBe(2);
    });

    it('should return converted date correctly (two digits)', () => {
        const convertedDate = dateHelper.getDate('22');
        expect(convertedDate.getFullYear()).toBe(2022);
    });

    it('should return converted date correctly (three digits)', () => {
        const convertedDate = dateHelper.getDate('222');
        expect(convertedDate.getFullYear()).toBe(222);
    });

    it('should return converted date correctly (four digits)', () => {
        const convertedDate = dateHelper.getDate('2222');
        expect(convertedDate.getFullYear()).toBe(2222);
    });

    it('should return converted date correctly (five digits)', () => {
        const convertedDate = dateHelper.getDate('22223');
        expect(convertedDate.getFullYear()).toBe(2222);
    });

    it('should return converted date correctly (full date)', () => {
        const convertedDate = dateHelper.getDate('2022-01-01');
        expect(convertedDate.getFullYear()).toBe(2022);
        expect(convertedDate.getMonth() + 1).toBe(1);
        expect(convertedDate.getDate()).toBe(1);
    });

    it('should return invalid date', () => {
        expect(dateHelper.getDate('aaa').toString().toLowerCase()).toBe('invalid date');
    });
});
