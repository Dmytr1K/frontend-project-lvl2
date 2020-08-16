import _ from 'lodash';

const buildDiffTree = (dataBefore, dataAfter) => {
  const keysBefore = Object.keys(dataBefore);
  const keysAfter = Object.keys(dataAfter);
  const unsortedKeys = _.union(keysBefore, keysAfter);
  const sortedKeys = _.sortBy(unsortedKeys);

  const addEntry = (name) => {
    const valueBefore = dataBefore[name];
    const valueAfter = dataAfter[name];

    if (valueBefore === valueAfter) return { name, type: 'unchanged', value: valueAfter };
    if (valueBefore === undefined) return { name, type: 'added', value: valueAfter };
    if (valueAfter === undefined) return { name, type: 'removed', value: valueBefore };
    if (_.isObject(valueBefore) && _.isObject(valueAfter)) {
      return {
        name, type: 'nested', children: buildDiffTree(valueBefore, valueAfter),
      };
    }
    return {
      name, type: 'updated', valueBefore, valueAfter,
    };
  };

  return sortedKeys.map(addEntry);
};

export default buildDiffTree;
