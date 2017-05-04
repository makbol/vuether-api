module.exports = {
  onProd: () => process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production'
};
