export const all = (coll) => coll.reduce((acc, el) => acc && el, true);
export const any = (coll) => coll.reduce((acc, el) => acc || el, false);

export const getLast = (coll) => coll[coll.length - 1];

export const arrayEQ = (coll1, coll2) => {
  return all(coll1.map((str, index) => str === coll2[index]));
}

export const arrayPartialEQ = (coll1, coll2) => {
  // if same length then lets use arrayEQ to avoid re-renders
  if (coll1.length === coll2.length) return arrayEQ(coll1, coll2);

  return coll1[0] === coll2[0];
}

export const getIn = (path, map, defaultValue = undefined) => {
  return path.reduce((acc, step) => {
    if ((acc !== undefined && acc[step] === undefined) || acc === undefined) return defaultValue;
    return acc[step];
  }, map);
}

export const updateIn = (
  path,
  changeFn,
  fnArgs,
  map,
) => {
  // Note: This is update in place
  // walk the data-structure with the path provided to get the current-value
  let value = getIn(path, map);
  let newValue = changeFn(value, fnArgs, map); // apply the supplied update function
  let [lastKey] = path.slice(-1);

  // update the path with the new value computed with `changeFn`
  let val = path.slice(0, -1).reduce((acc: any, key) => acc[key], map);
  val[lastKey] = newValue;

  // returns the map
  return map;
};
