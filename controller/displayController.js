const express = require('express');
const util = require('util');
const moment = require('moment');
const _ = require('lodash');
const router = express.Router();

const config = require('../config');
const { writeFile, createDir, createSaveFileData, deleteFile } = require('../modules/fileModule');
const { respondJson, respondOnError } = require('../utils/respond');
const { displayModel } = require('../model');
const resultCode = require('../utils/resultCode');
const { imagesTypeCheck } = require('../utils/common');
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
        const fileName = req.files ? req.files.image.name : false;
        const { branch, brand, location, image } = req.body;
        const data = {
            branch: branch,
            brand: brand,
            location: location
        };

        if (image && image instanceof String) {
            data.imageUrl = image;
        }

        fileName
        ? go(
            null,
            createDir,
            dir => createSaveFileData(fileName, dir, brand),
            result => {
                data.imagePath = result.path;
                data.imageUrl = `${config.server.base_url}/assets/images/${moment().tz('Asia/Seoul').format('YYYYMMDD')}/${result.name}`;
                req.files.image.name = result.name;
                return req.files;
            },
            imagesTypeCheck,
            writeFile,
            _ => displayModel.create(data).catch(e => { throw e }),
            result => !!result.dataValues 
            ? respondJson(res, resultCode.success, result.dataValues)
            : respondOnError(res, resultCode.error, { desc: 'Display with Image Create Fail, Check Your Parameters!' })
        ) 
        : go(
            data,
            insertData => displayModel.create(insertData).catch(e => { throw e }),
            result => {
                return !!result.dataValues
                ?   respondJson(res, resultCode.success, result.dataValues)
                :   respondOnError(res, resultCode.error, { desc: 'Display Create Fail, Check Your Parameters!' })
            }
        )
    } catch (error) {
        respondOnError(res, resultCode.error, error.message);
    }
});

router.post('/update', async (req, res) => {
    try {
        const fileName = req.files ? req.files.image.name : false;
        const { id, branch, brand, location, image } = req.body;
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

        if (image && image instanceof String) {
            options.data.imageUrl = image;
        }

        fileName
        ? go(
            null,
            _ => displayModel.findOne({ where: { id: id } }),
            result => {
                if (result.dataValues) {
                    resultData = JSON.parse(JSON.stringify(result.dataValues));
                    if (result.dataValues.imagePath) {
                        deleteFile(result.dataValues.imagePath);
                    }
                } else{
                    throw new Error("No Such Data")
                }
            },
            createDir,
            dir => createSaveFileData(fileName, dir, brand),
            result => {
                options.data.imagePath = result.path;
                options.data.imageUrl = `${config.server.base_url}/assets/images/${moment().tz('Asia/Seoul').format('YYYYMMDD')}/${result.name}`;
                req.files.image.name = result.name;
                return req.files;
            },
            imagesTypeCheck,
            writeFile,
            _ => displayModel.update(options).catch(e => { throw e }),
            result => result[0] > 0 
            ? respondJson(res, resultCode.success, { desc: 'Display Update Success' })
            : respondOnError(res, resultCode.error, { desc: 'Display with Image Update Fail, Check Your Parameters!' })
        ) 
        : go(
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
            options => displayModel.findOne(options),
            result => {
                if (result.dataValues) {
                    if (result.dataValues.imagePath) {
                        deleteFile(result.dataValues.imagePath);
                    };
                    console.log(result.dataValues.id);
                    return {
                        where: {
                            id: result.dataValues.id
                        }
                    };
                } else {
                    throw new Error("No Such Data")
                }
            },
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