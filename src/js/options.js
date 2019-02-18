function isDevel()
{
  return !window.location.href.includes('charsheet.su/');
}

function isRevision()
{
  return window.location.pathname.split('/').length === 6;
}

export {isDevel, isRevision};
