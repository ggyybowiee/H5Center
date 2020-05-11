exports.twoDecimal = (value) => {
  if (value) {
    return value.toFixed(2);
  }

  return 0;
};

exports.oneDecimal = (value) => {
  if (value) {
    return value.toFixed(1);
  }

  return 0;
};
