const express = require('express');
const util = require('util');
const moment = require('moment');
const _ = require('lodash');
const router = express.Router();

const config = require('../config');
const { respondJson, respondOnError } = require('../utils/respond');
const { userModel } = require('../model');
const resultCode = require('../utils/resultCode');
const { parameterFormCheck } = require('../utils/common');

const controllerName = 'User';

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
    const { userid = false, password = false } = req.body;

    if (!userid || !password) { throw { message: 'Incorrect Information!' }; };

    const options = {
      where : {
        userid: userid,
        password: password
      }
    };

    accountInfo = await go(
      options,
      userModel.find,
      result => result.length > 0 ? result[0].dataValues : result
    );

    return !!accountInfo.id
    ? ((account) => {
      //req.session.auth = account.id; // api 호출 시 체크할 값
      //req.session.name = account.username;
      respondJson(res, resultCode.success, account);
     })(accountInfo) 
    : respondOnError(res, resultCode.error, { desc: 'Invalid User' });
  } catch (error) {
    return respondOnError(res, resultCode.error, error.message);
  }
});

router.post('/create', async (req, res) => {
  try {
    const { userid, password, username } = req.body;

    const data = {
        userid: userid,
        password: password,
        username: username
    };

    return go(
      data,
      insertData => userModel.create(insertData).catch(e => { throw e }),
      result => {
          return !!result.dataValues
          ?   respondJson(res, resultCode.success, result.dataValues)
          :   respondOnError(res, resultCode.error, { desc: 'User Register Fail, Check Your Parameters!' })
      }
    );
  } catch (error) {
    return respondOnError(res, resultCode.error, error.message);
  }
});

router.post('/logout', async (req, res) => {
  try {
    //req.session.destroy();
    return respondJson(res, resultCode.success, 'Logout Success');
  } catch (error) {
    return respondOnError(res, resultCode.error, error.message);
  }
});

module.exports = router;