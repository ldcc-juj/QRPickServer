const util = require('util');
const moment = require('moment-timezone');

const { userCtrl, displayCtrl, itemCtrl } = require('../controller');

const RouteModules = (function(){
    return {
        Init: function(){
            app.use((req, res, next) => {
                res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
                console.log(util.format('[Logger]::[Route]::[Access URL %s]::[Access Ip %s]::[Access Time %s]',
                    req.originalUrl,
                    req.ip,
                    moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')
                ));
                next();
            });

            app.use('/user', userCtrl);
            app.use('/display', displayCtrl);
            app.use('/item', itemCtrl);
            console.log(util.format('[Logger]::[Route]::[Service]::[%s]::[Started]', 
            moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')));
        }
    };
})();

module.exports = RouteModules;