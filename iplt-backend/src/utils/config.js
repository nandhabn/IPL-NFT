module.exports = {
  jsonRPCProvider: process.env.BINANCE_JSON_RPC_PROVIDER,
  adminPrivateKey: process.env.ADMIN_PRIVATE_KEY,
  mongo: {
    uri: process.env.MONGODB_URI,
    options: {
      keepAlive: 1,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
  },
  env: process.env.NODE_ENV,
};
