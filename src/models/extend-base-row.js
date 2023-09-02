const BaseRow = Object.create(Array.prototype);

BaseRow.from = function (data) {
  if (!Array.isArray(data)) {
    throw new Error("Expected an array; got " + data);
  }
  const baseRow = Object.create(BaseRow);

  for (let i = 0; i < data.length; i++) {
    baseRow[i] = data[i];
  }
  return baseRow;
};

BaseRow.toArray = function () {
  return [...this];
};

const extendBaseRow = (propertyDescriptorMap) => {
  const child = Object.create(BaseRow);
  Object.defineProperties(child, propertyDescriptorMap);
  return child;
};

export default extendBaseRow;
