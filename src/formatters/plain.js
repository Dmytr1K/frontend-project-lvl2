const converters = {
  object: () => '[complex value]',
  string: (data) => `'${data}'`,
  default: (data) => data,
};

const stringify = (value) => {
  const convert = converters[typeof value] || converters.default;

  return convert(value);
};

const mapping = {
  unchanged: () => [],
  removed: (property) => `Property '${property}' was removed`,
  added: (property, node) => `Property '${property}' was added with value: ${stringify(node.value)}`,
  changed: (property, node) => `Property '${property}' was updated. From ${stringify(node.valueBefore)} to ${stringify(node.valueAfter)}`,
  nested: (property, node, innerFormat) => innerFormat(node.children, property),
};

const format = (diffTree) => {
  const innerFormat = (diff, path) => {
    const callback = (node) => {
      const { name, type } = node;
      const property = path ? `${path}.${name}` : name;

      return mapping[type](property, node, innerFormat);
    };

    return diff.flatMap(callback).join('\n');
  };

  return innerFormat(diffTree, '');
};

export default format;
