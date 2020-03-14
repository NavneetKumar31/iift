const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

router.get('/', (req, res, next) => {
    Product.find({}).exec().then(docs => {
        if (docs.length < 1) {
            return res.status(200).json({
                count: docs.length,
                success: true,
                msg: 'No Products found.',
                result: docs
            });
        }
        res.status(200).json({
            count: docs.length,
            success: true,
            msg: 'Products list.',
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
    let newProduct = new Product();
    for (let key in req.body) {
        newProduct[key] = req.body[key];
    }
    newProduct.addedOn = Date.now();

    Product.find({
        name: req.body.name
    }).exec().then(docs => {
        if (docs.length > 0) {
            return res.status(409).json({
                count: docs.length,
                success: true,
                msg: 'Product already exists with name > ' + req.body.name,
                result: []
            });
        }
        return newProduct.save();
    }).then(doc => {
        res.status(201).json({
            count: 1,
            success: true,
            msg: 'Product added successfully with name > ' + req.body.name,
            result: []
        });
    }).catch(err => {
        res.status(500).json({
            success: false,
            msg: err.errmsg,
            error_details: err
        });
    });
});

router.patch('/:_id', (req, res, next) => {
    let updatedProduct = {
        $set: {}
    };
    for (let key in req.body) {
        updatedProduct[key] = req.body[key];
    }

    Product.update({
            _id: req.params._id
        }, updatedProduct).exec()
        .then(docs => {
            if (docs.nModified < 1) {
                return res.status(404).json({
                    count: docs.length,
                    success: false,
                    msg: 'No product found with id > ' + req.params._id,
                    result: []
                });
            }
            res.status(200).json({
                count: docs.nModified,
                success: true,
                msg: 'Product updated successfully with id > ' + req.params._id,
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

// delete by id
router.delete('/:id', (req, res, next) => {
    Product.findByIdAndRemove({
            _id: req.params.id
        }).exec()
        .then(docs => {
            if (!docs) {
                return res.status(404).json({
                    count: docs.length,
                    success: false,
                    msg: 'No Product find with > ' + req.params.id,
                    result: []
                });
            }
            res.status(200).json({
                count: docs.length,
                success: true,
                msg: 'Product deleted with > ' + req.params.id,
                result: []
            });
        }).catch(err => {
            res.status(500).json({
                success: false,
                msg: err.errmsg,
                result: err
            });
        });
});

// delete all
router.delete('/', (req, res, next) => {
    Product.remove({}).exec()
        .then(docs => {
            if (docs.n < 1) {
                return res.status(200).json({
                    count: docs.n,
                    success: false,
                    msg: 'No products found.',
                    result: docs
                });
            }
            res.status(200).json({
                count: docs.n,
                success: true,
                msg: 'All products deleted successfully.',
                result: []
            });
        }).catch(err => {
            res.status(500).json({
                success: false,
                msg: err.errmsg,
                error_details: err
            });
        });
});

module.exports = router;