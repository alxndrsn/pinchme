const { assert } = require('chai');

const toString = require('../../src/electron/to-string');

describe('toString()', () => {
  [
    {
      input: [],
      meta: '',
      expected: '',
    },
    {
      input: '54686520666f6c6c6f77696e6720746578742022cff174e872f1e074ecf2f1e16ced7ae274eef8f122207370656c6c732022496e7465726e6174696f6e616c697a6174696f6e22207573696e67207468652049534f2d383835392d3120636861636163746572207365742e2020496620796f752063616e207365652069742c20796f7572206f757470757420737570706f7274732049534f2d383835392d312c206f722063616e20636f6e766572742066726f6d2049534f2d383835392d3120746f20796f7572206e617469766520636861726163746572207365742e2020546865206e6578742074657874206973207468652073616d65206173207468697320706167652c206f6e6c7920697420757365732055532d41534349492e0a0a3d3e20303031340a0a',
      meta: 'text/gemini; charset=iso-8859-1',
      expected: 'The following text "Ïñtèrñàtìòñálízâtîøñ" spells "Internationalization" using the ISO-8859-1 chacacter set.  If you can see it, your output supports ISO-8859-1, or can convert from ISO-8859-1 to your native character set.  The next text is the same as this page, only it uses US-ASCII.\n\n=> 0014\n\n',
    },
  ]
    .forEach(({ input, meta, expected }) => {
      it(`Should convert string '${input}' with meta '${meta}' to '${expected}'`, () => {
        // expect
        assert.equal(toString(Buffer.from(input, 'hex'), meta), expected);
      });
    });
});
