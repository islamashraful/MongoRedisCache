const users = require("./users.mongo");

async function existsUserWithId(userId) {
  return users.findById(userId);
}

module.exports = {
  existsUserWithId,
};
