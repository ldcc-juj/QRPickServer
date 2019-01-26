const { item } = require('../entity');

const itemModel = (function () {
  return {
    create: async function (data) {
      return await item.create(data);
    },
    update: async function (options) {
      const { data, where } = options;
      return await item.update(data, {
          where: where
      });
    },
    findOne: async function (options) {
      return await item.findOne(options);
    },
    find: async function (options) {
      return await item.findAll(options);
    },
    delete: async function (options) {
        return await item.destroy(options);
    },
    decrementAmount: async function (options) {
        return await item.decrement('amount', options).then(_ => {
            let option = {
                where: options.where
            };
            return item.find(option);
        });
    }
  }
})();

module.exports = itemModel;