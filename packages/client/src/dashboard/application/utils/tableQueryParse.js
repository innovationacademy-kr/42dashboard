const destructObjectToArray = (prev, element) => {
  const { __typename, ...row } = element;
  const toArr = Object.values(row);
  const newarr = [];
  toArr.forEach((item) => {
    if (Array.isArray(item)) {
      const { __typename, ...cells } = item[0];
      newarr.push(...Object.values(cells));
    } else {
      newarr.push(item);
    }
  });
  return [...prev, newarr];
};

export const getRowsFromGqlResponse = (responseData) => {
  return Object.values(responseData)[0].reduce(destructObjectToArray, []);
};
