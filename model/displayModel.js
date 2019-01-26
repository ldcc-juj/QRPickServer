const { display } = require('../entity');

const displayModel = (function () {
  return {
    create: async function (data) {
      return await display.create(data);
    },
    update: async function (options) {
      const { data, where } = options;
      return await display.update(data, {
          where: where
      });
    },
    findOne: async function (options) {
      return await display.findOne(options);
    },
    find: async function () {
      return await display.findAll();
    },
    delete: async function(options) {
        return await display.destroy(options);
    }
  }
})();

module.exports = displayModel;