require('./utils/functional');

const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const moment = require('moment-timezone');
const util = require('util');
var expressSession = require("express-session");
var cookieParser = require("cookie-parser");

const config = require('./config');
const routeModule = require('./modules/routeModules');
const entityModule = require('./modules/entityModule');

global.app = new express();

var sessionCheck = (req, res, next) => {
    if (req.session.auth && req.cookies.user_sid) {
        res.redirect("/admin");
    } else {
        next();
    }
};

function processRun() {
    (async () => {
        app.set('port', process.env.PORT || config.server.port);
        app.use(bodyParser.json({limit: '15mb'}));
        app.use(bodyParser.urlencoded({ extended: true, limit: '15mb' }));
        app.use(cookieParser());
        app.use(
            expressSession({
                key: "user_sid",
                secret: "@#@$MYSIGN#@$#$",
                resave: false,
                saveUninitialized: false
            })
        );

        app.use(fileUpload({
            limits: { fileSize: 15 * 1024 * 1024 },
        }));
        app.use(methodOverride());
        app.use("/views", express.static(path.join(__dirname, "views")));
        app.use("/assets", express.static(path.join(__dirname, "assets")));

        app.get("/admin", (req, res) => {
            if (req.session.auth && req.cookies.user_sid) {
                res.sendFile(__dirname + "/views/auth.html");
            } else {
                res.redirect("/login");
            }
            
        });

        app.get("/userlist", (req, res) => {
            if (req.session.auth && req.cookies.user_sid) {
                res.sendFile(__dirname + "/views/UserList/userList.html");
            } else {
                res.redirect("/login");
            }
        });

        app.get("/displaylist", (req, res) => {
            if (req.session.auth && req.cookies.user_sid) {
                res.sendFile(__dirname + "/views/DisplayList/displayList.html");
            } else {
                res.redirect("/login");
            }
        });

        app.get("/itemlist", (req, res) => {
            if (req.session.auth && req.cookies.user_sid) {
                res.sendFile(__dirname + "/views/ItemList/itemList.html");
            } else {
                res.redirect("/login");
            }
        });

        app.get("/login", (req, res) => {
            res.sendFile(__dirname + "/views/vendors/materialize-admin/html/fixed-menu/user-login.html");
        });

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