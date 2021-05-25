const { assert } = require('chai');

const resolveUri = require('../../src/react/resolve-uri');

describe('resolveUri()', () => {
  [
    [ 'gemini://gemini.conman.org/test/torture/0002', undefined, 'gemini://gemini.conman.org/test/torture/0002' ],
    [ 'gemini://gemini.conman.org/test/torture/0002', 'gemini://gemini.conman.org/test/torture/0001', 'gemini://gemini.conman.org/test/torture/0002' ],
    [ 'docs/', 'gemini://gemini.circumlunar.space/', 'gemini://gemini.circumlunar.space/docs/' ],
    [ '/test/torture/0005', 'gemini://gemini.conman.org/test/torture/0004', 'gemini://gemini.conman.org/test/torture/0005' ],
    [ '0007', 'gemini://gemini.conman.org/test/torture/0006', 'gemini://gemini.conman.org/test/torture/0007' ],
    [ 'gopher://zaibatsu.circumlunar.space/1/~solderpunk/gemini', 'gemini://gemini.conman.org/test/torture/0006', 'gopher://zaibatsu.circumlunar.space/1/~solderpunk/gemini' ],
    //[ '/test/../test/torture/0009', 'gemini://gemini.conman.org/test/torture/0008', 'gemini://gemini.conman.org/test/torture/0009' ], something for the future
  ].forEach(([ shortform, current, expected ]) => {
    it(`should expand ${shortform} into ${expected} for parent page ${current}`, () => {
      // expect
      assert.equal(resolveUri(shortform, current), expected);
    });
  });
});
