export const log = (text, data) => {
  console.log(`%c ${text}`, "font-weight: bold;", data);
};

// sorting
const comparators = {
  string: {
    "desc": (str1, str2) => str2.localeCompare(str1),
    "asc": (str1, str2) => str1.localeCompare(str2),
  },
  number: {
    "desc": (num1, num2) => num2 - num1,
    "asc": (num1, num2) => num1 - num2,
  },
};

export const sortBy = (data, { attr, type, dataType }) => {
  const comparator = (data1, data2) => comparators[dataType][type](data1[attr], data2[attr]);
  return Object.values(data).sort(comparator).map(({ id }) => id);
};
