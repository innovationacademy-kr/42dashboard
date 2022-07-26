const opeatorDict = {};
opeatorDict['>'] = (lhs, rhs) => {
  return lhs > rhs;
};
opeatorDict['>='] = (lhs, rhs) => {
  return lhs >= rhs;
};
opeatorDict['<'] = (lhs, rhs) => {
  return lhs < rhs;
};
opeatorDict['<='] = (lhs, rhs) => {
  return lhs <= rhs;
};
opeatorDict['='] = (lhs, rhs) => {
  return lhs == rhs;
};
opeatorDict['=='] = (lhs, rhs) => {
  return lhs == rhs;
};
opeatorDict['!='] = (lhs, rhs) => {
  return lhs != rhs;
};
opeatorDict['Like'] = (lhs, rhs) => {
  return rhs.contain(lhs);
};
opeatorDict['like'] = (lhs, rhs) => {
  return rhs.contain(lhs);
};
opeatorDict['ILike'] = (lhs, rhs) => {
  lhs = lhs.toLowerCase();
  rhs = rhs.toLowerCase();
  return rhs.contain(lhs);
};
opeatorDict['iLike'] = (lhs, rhs) => {
  lhs = lhs.toLowerCase();
  rhs = rhs.toLowerCase();
  return rhs.contain(lhs);
};
opeatorDict['Ilike'] = (lhs, rhs) => {
  lhs = lhs.toLowerCase();
  rhs = rhs.toLowerCase();
  return rhs.contain(lhs);
};
opeatorDict['ilike'] = (lhs, rhs) => {
  lhs = lhs.toLowerCase();
  rhs = rhs.toLowerCase();
  return rhs.contain(lhs);
};
opeatorDict['In'] = (lhs, rhs) => {
  const arr = lhs.split(';');
  return arr.includes(rhs);
};
opeatorDict['in'] = (lhs, rhs) => {
  const arr = lhs.split(';');
  return arr.includes(rhs);
};
opeatorDict['Between'] = (lhs, rhs) => {
  const arr = lhs.split(';');
  return arr[0] <= rhs && rhs <= arr[1];
};
opeatorDict['between'] = (lhs, rhs) => {
  const arr = lhs.split(';');
  return arr[0] <= rhs && rhs <= arr[1];
};
opeatorDict['null'] = (lhs, rhs) => {
  return rhs == null;
};

export { opeatorDict };
