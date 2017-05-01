var dbConfig = {
  development: {
    connectionString: "mongodb://localhost:27017/dev_handsonuser"
  },
  test: {
    connectionString: "mongodb://localhost:27017/test_handsonuser"
  }
};
module.exports = dbConfig;
