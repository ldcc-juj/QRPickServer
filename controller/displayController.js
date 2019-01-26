const express = require('express');
const util = require('util');
const moment = require('moment');
const _ = require('lodash');
const router = express.Router();

const config = require('../config');
const { respondJson, respondOnError } = require('../utils/respond');
const { displayModel } = require('../model');
const resultCode = require('../utils/resultCode');

const controllerName = 'Display';

router.use((req, res, next) => {

    console.log(util.format('[Logger]::[Controller]::[%sController]::[Access Ip %s]::[Access Time %s]',
                                controllerName,
                                req.ip,
                                moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')
                            ));

    next();
});

router.get('/list', async (req, res) => {
  try {
    return go(
        _,
        displayModel.find,
        data => data.length >= 0
        ? respondJson(res, resultCode.success, data)
        : respondOnError(res, resultCode.error, { desc: 'Error on find all displays' })
        
    );
  } catch (error) {
    return respondOnError(res, resultCode.error, error.message);
  }
});

router.post('/detail', async (req, res) => {
    try {
        const { id } = req.body;
        const options = {
            where: {
                id: id
            }
        };

        return go(
            options,
            displayModel.findOne,
            data => data
            ? respondJson(res, resultCode.success, data)
            : respondOnError(res, resultCode.error, { desc: 'Not Found Display! Check Your URL Parameter!'})
        );
    }
    catch (error) {
        respondOnError(res, resultCode.error, error.message);
    }
});

router.post('/create', async (req, res) => {
    try {
        const { branch, brand, location } = req.body;
        const data = {
            branch: branch,
            brand: brand,
            location: location
        };

        return go(
            data,
            insertData => displayModel.create(insertData).catch(e => { throw e }),
            result => {
                return !!result
                ?   respondJson(res, resultCode.success, result)
                :   respondOnError(res, resultCode.error, { desc: 'Display Create Fail, Check Your Parameters!' })
            }
        );
    } catch (error) {
        respondOnError(res, resultCode.error, error.message);
    }
});

router.post('/update', async (req, res) => {
    try {
        const { id, branch, brand, location } = req.body;
        const options = {
            where: {
                id: id
            },
            data: {
                branch: branch,
                brand: brand,
                location: location
            }
        };

        return go(
            options,
            options => displayModel.update(options).catch(e => { throw e }),
            result => result[0] > 0 
            ? respondJson(res, resultCode.success, { desc: 'Display Update Success' })
            : respondOnError(res, resultCode.error, { desc: 'Display Update Fail, Check Your Parameters!' })
        );
    } catch (error) {
        respondOnError(res, resultCode.error, error.message);
    }
});

router.post('/delete', async (req, res) => {
    try {

        const { id } = req.body;
        const options = {
            where: {
                id: id
            }
        };

        return await go(
            options,
            options =>  displayModel.delete(options).catch(e => { throw e }),
            result => {
                return result > 0 
                ? respondJson(res, resultCode.success, result)
                : respondOnError(res, resultCode.error, { desc: 'Display Delete Fail, Check Your Parameters!' })
            }
        );
    } catch (error) {
        respondOnError(res, resultCode.error, error.message);
    }
});

module.exports = router;