function genOrderCode() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `ORD-${n}`;
}

module.exports = { genOrderCode };
