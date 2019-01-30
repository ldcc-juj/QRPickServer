const express = require('express');
const util = require('util');
const moment = require('moment');
const _ = require('lodash');
const router = express.Router();

const config = require('../config');
const { respondJson, respondOnError } = require('../utils/respond');
const { authModel } = require('../model');
const resultCode = require('../utils/resultCode');
const { parameterFormCheck } = require('../utils/common');
var cookieParser = require("cookie-parser");
const controllerName = 'Auth';

router.use((req, res, next) => {
  console.log(util.format('[Logger]::[Controller]::[%sController]::[Access Ip %s]::[Access Time %s]',
                              controllerName,
                              req.ip,
                              moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')
                          ));

  go(
    req.body || req.params || req.query,
    parameterFormCheck,
    result => result
    ? next()
    : respondOnError(res, resultCode.incorrectParamForm, { desc: "Incorrect Parameter Form" })
  );
});

router.post('/login', async (req, res) => {
  try {
    const { authid = false, password = false } = req.body;

    if (!authid || !password) { throw { message: 'Incorrect Information!' }; };

    const options = {
      where : {
        authid: authid,
        password: password
      }
    };

    accountInfo = await go(
      options,
      authModel.find,
      result => result.length > 0 ? result[0].dataValues : result
    );

    return !!accountInfo.id
    ? ((account) => {
      req.session.auth = account.id; // api 호출 시 체크할 값
		  res.cookie("user_sid", req.session.auth);
      respondJson(res, resultCode.success, account);
     })(accountInfo) 
    : respondOnError(res, resultCode.error, { desc: 'Invalid Auth' });
  } catch (error) {
    return respondOnError(res, resultCode.error, error.message);
  }
});

router.post('/logout', async (req, res) => {
  try {
    req.session.destroy();
    return respondJson(res, resultCode.success, 'Logout Success');
  } catch (error) {
    return respondOnError(res, resultCode.error, error.message);
  }
});

module.exports = router;