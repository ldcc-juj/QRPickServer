const { user } = require('../entity');

const userModel = (function () {
  return {
    create: async function (data) {
      return await user.create(data);
    },
    update: async function (options) {
      const { data, where } = options;
      return await user.update(data, {
          where: where
      });
    },
    findOne: async function (options) {
      return await user.findOne(options);
    },
    find: async function (options) {
      if (!options) {
        return await user.findAll();
      } 
      return await user.findAll(options);
    },
    delete: async function(options) {
        return await user.destroy(options);
    }
  }
})();

module.exports = userModel;