const express = require('express');
const util = require('util');
const moment = require('moment');
const _ = require('lodash');
const router = express.Router();

const config = require('../config');
const { respondJson, respondOnError } = require('../utils/respond');
const { itemModel } = require('../model');
const resultCode = require('../utils/resultCode');

const controllerName = 'Item';

router.use((req, res, next) => {

    console.log(util.format('[Logger]::[Controller]::[%sController]::[Access Ip %s]::[Access Time %s]',
                                controllerName,
                                req.ip,
                                moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')
                            ));

    next();
});

router.post('/list', async (req, res) => {
    try {
        const { brand } = req.body;
        const options = {
            where: {
                brand: brand
            }
        };
        return go(
            options,
            itemModel.find,
            data => data.length >= 0
            ? respondJson(res, resultCode.success, data)
            : respondOnError(res, resultCode.error, { desc: 'Error on find all items' })
            
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
            itemModel.findOne,
            data => data
            ? respondJson(res, resultCode.success, data)
            : respondOnError(res, resultCode.error, { desc: 'Not Found Item! Check Your URL Parameter!'})
        );
    }
    catch (error) {
        respondOnError(res, resultCode.error, error.message);
    }
});

router.post('/create', async (req, res) => {
    try {
        const { modelNumber, category, price, name, discountPrice, brand, amount, information } = req.body;
        const data = {
            modelNumber: modelNumber,
            category: category,
            price: price,
            name: name,
            discountPrice: discountPrice,
            brand: brand,
            amount: amount,
            information: information
        };

        return go(
            data,
            insertData => itemModel.create(insertData).catch(e => { throw e }),
            result => {
                return !!result
                ?   respondJson(res, resultCode.success, result)
                :   respondOnError(res, resultCode.error, { desc: 'Item Create Fail, Check Your Parameters!' })
            }
        );
    } catch (error) {
        respondOnError(res, resultCode.error, error.message);
    }
});

router.post('/update', async (req, res) => {
    try {
        const { id, modelNumber, category, price, name, discountPrice, brand, amount, information } = req.body;
        const options = {
            where: {
                id: id
            },
            data: {
                modelNumber: modelNumber,
                category: category,
                price: price,
                name: name,
                discountPrice: discountPrice,
                brand: brand,
                amount: amount,
                information: information
            }
        };

        return go(
            options,
            options => itemModel.update(options).catch(e => { throw e }),
            result => result[0] > 0 
            ? respondJson(res, resultCode.success, { desc: 'Item Update Success' })
            : respondOnError(res, resultCode.error, { desc: 'Item Update Fail, Check Your Parameters!' })
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
            options =>  itemModel.delete(options).catch(e => { throw e }),
            result => {
                return result > 0 
                ? respondJson(res, resultCode.success, result)
                : respondOnError(res, resultCode.error, { desc: 'Item Delete Fail, Check Your Parameters!' })
            }
        );
    } catch (error) {
        respondOnError(res, resultCode.error, error.message);
    }
});

router.post('/decreseAmount', async (req, res) => {
    try {

        const { id, amount = 1 } = req.body;
        const options = {
            by: amount,
            where: {
                id: id
            }
        };

        return await go(
            options,
            options =>  itemModel.decrementAmount(options).catch(e => { throw e }),
            result => {
                return result
                ? respondJson(res, resultCode.success, result)
                : respondOnError(res, resultCode.error, { desc: 'Item Decrease Fail, Check Your Parameters!' })
            }
        );
    } catch (error) {
        respondOnError(res, resultCode.error, error.message);
    }
});

module.exports = router;