const { auth } = require('../entity');

const authModel = (function () {
  return {
    create: async function (data) {
      return await auth.create(data);
    },
    update: async function (options) {
      const { data, where } = options;
      return await auth.update(data, {
          where: where
      });
    },
    findOne: async function (options) {
      return await auth.findOne(options);
    },
    find: async function (options) {
      return await auth.findAll(options);
    },
    delete: async function(options) {
        return await auth.destroy(options);
    }
  }
})();

module.exports = authModel;