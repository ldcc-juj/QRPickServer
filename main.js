require('./utils/functional');

const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment-timezone');
const util = require('util');

const config = require('./config');
const routeModule = require('./modules/routeModules');
const entityModule = require('./modules/entityModule');

global.app = new express();
global.baseUrl = process.env.NODE_ENV === 'ec2' ? `http://ec2-18-225-32-252.us-east-2.compute.amazonaws.com:${config.server.port}`
: `http://localhost:${config.server.port}`;

function processRun() {
    (async () => {
        app.set('port', process.env.PORT || config.server.port);
        app.use(bodyParser.json({limit: '15mb'}));
        app.use(bodyParser.urlencoded({ extended: true, limit: '15mb' }));

        entityModule.Init();
        routeModule.Init();
    })().then(_ => {
        http.createServer(app).listen(app.get('port'), () => {
            console.log(util.format('[Logger]::[Process On]::[Pid:%d]::[Server Running At %d]::[%s]::[Started]',
                                process.pid,
                                config.server.port,
                                moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')));
        });
    });
};

processRun();