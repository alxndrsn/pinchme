const { Iconv } = require('iconv');

module.exports = (buf, meta) => {
  const encoding = getCharsetFrom(meta);

  if(!encoding) return buf.toString();

  const iconv = new Iconv(encoding, 'utf-8');

  return iconv.convert(buf).toString();
};

function getCharsetFrom(meta) {
  if(!meta) return;

  const raw = meta.toLowerCase().split(';').map(it => it.trim()).find(it => it.startsWith('charset='));
  if(!raw) return;

  return raw.substring(8);
}
