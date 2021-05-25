module.exports = (target, current) => {
  return target.match(/^\w+:/)   ? target :
         target.startsWith('//') ? `gemini:${target}` :
         target.startsWith('/')  ? `gemini://${current.split('/')[2]}${target}` :
         discardFilename(current) + '/' + target;
};

function discardFilename(p) {
  if(p.endsWith('/')) return p.substring(0, p.length-1);
  const parts = p.split('/');
  parts.pop();
  return parts.join('/');
}
