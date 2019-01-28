const util = require('util');
const moment = require('moment');
const { user, display, item, auth } = require('../entity');

const EntityModule = (function () {
    return {
        Init: function () {
            item.belongsTo(display, { foreignKey : 'brandId', onUpdate : 'CASCADE', onDelete: 'CASCADE' });
            user.sync()
            .then(() => {
                auth.sync()
                .then(() => {
                    display.sync()
                    .then(() => {
                        item.sync()
                        .then(() => {
                        console.log(util.format('[Logger]::[Entity]::[Service]::[%s]::[Initialized]', moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')));
                        });
                    });
                });
            })
            .catch(e => console.log(util.format('[Logger]::[EntityService Error]::[Access Time %s]::[%s]', moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'), e.message
                                  )));
        }
    }
})();

module.exports = EntityModule;