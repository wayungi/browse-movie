import commentCounter from '../commentCounter.js';

describe('Comment counter ', () => {
  test('[] should return 0', () => {
    // TODO: AAA

    const input = [];

    expect(commentCounter(input)).toBe(0);
  });
  test('[] should return 0', () => {
    // TODO: AAA

    const input = ['1', '2'];

    expect(commentCounter(input)).toBe(2);
  });
});
