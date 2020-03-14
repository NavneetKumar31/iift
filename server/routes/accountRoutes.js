const express = require('express');
const router = express.Router();
const Account = require('../models/accountModel');

router.get('/', (req, res, next) => {
    Account.find({}).exec().then(docs => {
        if (docs.length < 1) {
            return res.status(200).json({
                count: docs.length,
                success: true,
                msg: 'No Accounts found.',
                result: docs
            });
        }
        res.status(200).json({
            count: docs.length,
            success: true,
            msg: 'Account list.',
            result: docs
        });
    }).catch(err => {
        res.status(500).json({
            success: false,
            msg: err.errmsg,
            error_details: err
        });
    });
});

router.get('/:name', (req, res, next) => {
    Account.find({
        name: req.params.name
    }).exec().then(docs => {
        if (docs.length < 1) {
            return res.status(200).json({
                count: docs.length,
                success: true,
                msg: 'No Account found for >> ' + req.params.name,
                result: []
            });
        }
        res.status(200).json({
            count: docs.length,
            success: true,
            msg: 'Account details for >> ' + req.params.name,
            result: docs
        });
    }).catch(err => {
        res.status(500).json({
            success: false,
            msg: err.errmsg,
            error_details: err
        });
    });
});

router.post('/', (req, res, next) => {
    let newAccount = new Account();
    for (let key in req.body) {
        newAccount[key] = req.body[key];
    }
    newAccount.modifiedOn = Date.now();

    Account.find({
        name: req.body.name
    }).exec().then(docs => {
        if (docs.length > 0) {
            return res.status(409).json({
                count: docs.length,
                success: true,
                msg: 'Account already exists for >> ' + req.body.name,
                result: []
            });
        }
        return newAccount.save();
    }).then(doc => {
        res.status(201).json({
            count: 1,
            success: true,
            msg: 'Account added successfully for >> ' + req.body.name,
            result: [doc]
        });
    }).catch(err => {
        res.status(500).json({
            success: false,
            msg: err.errmsg,
            error_details: err
        });
    });
});

router.patch('/:name', (req, res, next) => {
    let updatedProduct = {
        $set: {}
    };
    for (let key in req.body) {
        updatedProduct[key] = req.body[key];
    }

    Account.update({
        name: req.params.name
    }, updatedProduct).exec().then(docs => {
        if (docs.nModified < 1) {
            return res.status(404).json({
                count: docs.length,
                success: false,
                msg: 'No account found for >> ' + req.params.name,
                result: []
            });
        }
        res.status(200).json({
            count: docs.nModified,
            success: true,
            msg: 'Account updated successfully for >> ' + req.params.name,
            result: []
        });
    }).catch(err => {
        res.status(500).json({
            success: false,
            msg: err.msg,
            error_details: err
        });
    });
});

module.exports = router;