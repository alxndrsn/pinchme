const { contextBridge } = require('electron')
const openUrl = require('open');
const geminiRequest = require('@derhuerst/gemini/client')

const toString = require('./to-string');

const geminiOpts = {
  followRedirects: false,
  tlsOpt: {
    rejectUnauthorized: false,
  },
};

function get(uri) {
  return new Promise((resolve, reject) => {
    geminiRequest(uri, geminiOpts, (err, res) => {
      if(err) return reject(normaliseErr(err));

      const bufs = [];

      res.on('data', d => bufs.push(d));
      res.on('end', () => {
        const { meta, statusCode } = res;

        // see: gemini://gemini.circumlunar.space/docs/specification.gmi
        if(statusCode >= 10 && statusCode < 20) {
          const res = { t:'input', v:meta };
          if(statusCode === 11) res.sensitive = true;
          return resolve(res);
        }
        if(statusCode >= 20 && statusCode < 30) {
          const mime = getMime(res.meta);
          const v = toString(Buffer.concat(bufs), res.meta);
          return resolve({ t:'success', v, mime });
        }
        if(statusCode >=30 && statusCode < 40) {
          return resolve({ t:'redirect', v:meta });
        }
        reject(new Error(`${res.statusCode} ${res.statusMessage}`));
      });
      res.on('error', err => reject(normaliseErr(err)));
    });
  });
}

contextBridge.exposeInMainWorld( 'gemini', { get, openUrl });

// convert error as otherwise it gets stringed when passing from node to browser
function normaliseErr(err) {
  const { message, stack } = err;
  return { ...err, message, stack };
}

function getMime(meta) {
  return meta.toLowerCase().split(';')[0].trim();
}
