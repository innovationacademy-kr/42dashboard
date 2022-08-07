const operatorDict = {};
operatorDict['>'] = (lhs, rhs) => {
  return lhs > rhs;
};
operatorDict['>='] = (lhs, rhs) => {
  return lhs >= rhs;
};
operatorDict['<'] = (lhs, rhs) => {
  return lhs < rhs;
};
operatorDict['<='] = (lhs, rhs) => {
  return lhs <= rhs;
};
operatorDict['='] = (lhs, rhs) => {
  return lhs == rhs;
};
operatorDict['=='] = (lhs, rhs) => {
  return lhs == rhs;
};
operatorDict['!='] = (lhs, rhs) => {
  return lhs != rhs;
};
operatorDict['In'] = (lhs, rhs) => {
  const arr = lhs.split(';');
  return arr.includes(rhs);
};
operatorDict['in'] = (lhs, rhs) => {
  const arr = lhs.split(';');
  return arr.includes(rhs);
};
operatorDict['Between'] = (lhs, rhs) => {
  const arr = lhs.split(';');
  return arr[0] <= rhs && rhs <= arr[1];
};
operatorDict['between'] = (lhs, rhs) => {
  const arr = lhs.split(';');
  return arr[0] <= rhs && rhs <= arr[1];
};
operatorDict['null'] = (lhs, rhs) => {
  return rhs == null;
};

// operatorDict['Like'] = (lhs, rhs) => {
//   return rhs.contain(lhs);
// };
// operatorDict['like'] = (lhs, rhs) => {
//   return rhs.contain(lhs);
// };
// operatorDict['ILike'] = (lhs, rhs) => {
//   lhs = lhs.toLowerCase();
//   rhs = rhs.toLowerCase();
//   return rhs.contain(lhs);
// };
// operatorDict['iLike'] = (lhs, rhs) => {
//   lhs = lhs.toLowerCase();
//   rhs = rhs.toLowerCase();
//   return rhs.contain(lhs);
// };
// operatorDict['Ilike'] = (lhs, rhs) => {
//   lhs = lhs.toLowerCase();
//   rhs = rhs.toLowerCase();
//   return rhs.contain(lhs);
// };
// operatorDict['ilike'] = (lhs, rhs) => {
//   lhs = lhs.toLowerCase();
//   rhs = rhs.toLowerCase();
//   return rhs.contain(lhs);
// };

export { operatorDict };
