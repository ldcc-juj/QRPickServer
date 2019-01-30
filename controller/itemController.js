const express = require('express');
const util = require('util');
const moment = require('moment');
const _ = require('lodash');
const router = express.Router();

const config = require('../config');
const { respondJson, respondOnError } = require('../utils/respond');
const { itemModel } = require('../model');
const resultCode = require('../utils/resultCode');
const { writeFile, createDir, createSaveFileData, deleteFile } = require('../modules/fileModule');
const { imagesTypeCheck } = require('../utils/common');
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
        const { brandId } = req.body;
        const options = {
            where: {
                brandId: brandId
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
            data =>  {
                data.dataValues
                ? respondJson(res, resultCode.success, data.dataValues)
                : respondOnError(res, resultCode.error, { desc: 'Not Found Item! Check Your URL Parameter!'})
            }
        );
    }
    catch (error) {
        respondOnError(res, resultCode.error, error.message);
    }
});

router.post('/create', async (req, res) => {
    try {
        const fileName = req.files ? req.files.image.name : false;
        const { modelNumber = "미입력", category = "미정", price = 0, name, discountPrice = null, brandId = null, amount, information = null, image } = req.body;
        const data = {
            modelNumber: modelNumber,
            category: category,
            price: price,
            name: name,
            discountPrice: discountPrice,
            brandId: brandId,
            amount: amount,
            information: (information instanceof Object) ? information : information ? JSON.parse(information) : null,
            imagePath: '',
            imageUrl: (image && image instanceof String) ? image : ''
        };

        fileName
        ? go(
            null,
            createDir,
            dir => createSaveFileData(fileName, dir, brandId),
            result => {
                data.imagePath = result.path;
                data.imageUrl = `${config.server.base_url}/assets/images/${moment().tz('Asia/Seoul').format('YYYYMMDD')}/${result.name}`;
                req.files.image.name = result.name;
                return req.files;
            },
            imagesTypeCheck,
            writeFile,
            _ => itemModel.create(data).catch(e => { throw e }),
            result => !!result.dataValues 
            ? respondJson(res, resultCode.success, result.dataValues)
            : respondOnError(res, resultCode.error, { desc: 'Item with Image Create Fail, Check Your Parameters!' })
        ) 
        : go(
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
        const fileName = req.files ? req.files.image.name : false;
        const { id, modelNumber, category="미정", price = 0, name, discountPrice = null, brandId = null, amount, information = null, image } = req.body;
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
                brandId: brandId,
                amount: amount,
                information: (!!information && information instanceof Object) ? information : information ? JSON.parse(information) : null
            }
        };

        if (image && image instanceof String) {
            options.data.imageUrl = image;
        }

        fileName
        ? go(
            null,
            _ => itemModel.find({ where: { id: id } }),
            result => {
                if (result[0]) {
                    resultData = JSON.parse(JSON.stringify(result[0]));
                    if (result[0].imagePath) {
                        deleteFile(result[0].imagePath);
                    }
                } else{
                    throw new Error("No Such Data")
                }
            },
            createDir,
            dir => createSaveFileData(fileName, dir, brandId),
            result => {
                options.data.imagePath = result.path;
                options.data.imageUrl = `${config.server.base_url}/assets/images/${moment().tz('Asia/Seoul').format('YYYYMMDD')}/${result.name}`;
                req.files.image.name = result.name;
                return req.files;
            },
            imagesTypeCheck,
            writeFile,
            _ => itemModel.update(options).catch(e => { throw e }),
            result => result[0] > 0 
            ? respondJson(res, resultCode.success, { desc: 'Item Update Success' })
            : respondOnError(res, resultCode.error, { desc: 'Item with Image Update Fail, Check Your Parameters!' })
        ) 
        : go(
            options,
            options => itemModel.update(options).catch(e => { throw e }),
            result => {
                if (result[0] > 0) {
                    let options = {
                        where: {
                            id: id
                        }
                    };
                    return itemModel.findOne(options).catch(e => { throw e });
                } else {
                    return false;
                }
            },
            result => !!result && result.dataValues
            ? respondJson(res, resultCode.success, result.dataValues)
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
            itemModel.find,
            result => {
                if (result[0]) {
                    if (result[0].imagePath) {
                        deleteFile(result[0].imagePath);
                    };
                    return {
                        where: {
                            id: result[0].id
                        }
                    };
                } else {
                    throw new Error("No Such Data")
                }
            },
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
