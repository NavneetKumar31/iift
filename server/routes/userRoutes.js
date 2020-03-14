const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const config = require('../config/database');
const User = require('../models/userModel');
const decryptJS = require('../ENCDEC/decrypt');
const encryptJS = require('../ENCDEC/encrypt');

// get all users
router.get('/', (req, res, next) => {
    User.find({}).exec().then(docs => {
        if (docs.length < 1) {
            return res.status(404).json({
                count: docs.length,
                success: true,
                msg: 'No Users found.',
                result: docs
            });
        }
        res.status(200).json({
            count: docs.length,
            success: true,
            msg: 'Users list.',
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

router.get('/getCommissionDetails/:name', (req, res, next) => {
    const result = {
        name: req.params.name,
        fatherDetails: [{
                name: 'N/A',
                commission: 0,
                level: ''
            },
            {
                name: 'N/A',
                commission: 0,
                level: ''
            },
            {
                name: 'N/A',
                commission: 0,
                level: ''
            },
            {
                name: 'N/A',
                commission: 0,
                level: ''
            },
            {
                name: 'N/A',
                commission: 0,
                level: ''
            }
        ]
    };

    User.find({
        name: req.params.name
    }).exec().then(firstDocs => {
        if (firstDocs.length < 1) {
            return res.status(404).json({
                count: firstDocs.length,
                success: true,
                msg: 'No data found',
                result: [firstDocs]
            });
        }
        result.fatherDetails[0].name = firstDocs[0].addedBy;
        result.fatherDetails[0].level = 'first';
        result.fatherDetails[0].commission = 0;

        User.find({
            name: firstDocs[0].addedBy
        }).exec().then(secondDocs => {
            if (secondDocs.length < 1) {
                return res.status(200).json({
                    count: 1,
                    success: true,
                    msg: 'Get list',
                    result: [result]
                });
            }
            result.fatherDetails[1].name = secondDocs[0].addedBy;
            result.fatherDetails[1].level = 'second';
            result.fatherDetails[1].commission = 0;

            User.find({
                name: secondDocs[0].addedBy
            }).exec().then(thirdDocs => {
                if (thirdDocs.length < 1) {
                    return res.status(200).json({
                        count: 2,
                        success: true,
                        msg: 'Get list',
                        result: [result]
                    });
                }
                result.fatherDetails[2].name = thirdDocs[0].addedBy;
                result.fatherDetails[2].level = 'third';
                result.fatherDetails[2].commission = 0;

                User.find({
                    name: thirdDocs[0].addedBy
                }).exec().then(fourthDocs => {
                    if (fourthDocs.length < 1) {
                        return res.status(200).json({
                            count: 3,
                            success: true,
                            msg: 'Get list',
                            result: [result]
                        });
                    }
                    result.fatherDetails[3].name = fourthDocs[0].addedBy;
                    result.fatherDetails[3].level = 'fourth';
                    result.fatherDetails[3].commission = 0;

                    User.find({
                        name: fourthDocs[0].addedBy
                    }).exec().then(fifthDocs => {
                        if (fifthDocs.length < 1) {
                            return res.status(200).json({
                                count: 4,
                                success: true,
                                msg: 'Get list',
                                result: [result]
                            });
                        }
                        result.fatherDetails[4].name = fifthDocs[0].addedBy;
                        result.fatherDetails[4].level = 'fifth';
                        result.fatherDetails[4].commission = 0;

                        res.status(200).json({
                            count: 5,
                            success: true,
                            msg: 'get fathers list.',
                            result: [result]
                        });
                    });
                });
            });
        });
    }).catch(err => {
        res.status(500).json({
            success: false,
            msg: err.errmsg,
            error_details: err
        });
    });
});

// add user
router.post('/', (req, res, next) => {
    let newUser = new User();
    for (let key in req.body) {
        newUser[key] = req.body[key];
    }
    newUser.registeredOn = Date.now();

    User.find({
        email: req.body.email
    }).exec().then(docs => {
        if (docs.length > 0) {
            return res.status(409).json({
                count: docs.length,
                success: true,
                msg: 'User already exists with email > ' + req.body.email,
                result: []
            });
        }
        return newUser.save();
    }).then(doc => {
        res.status(201).json({
            count: 1,
            success: true,
            msg: 'User added successfully with email > ' + req.body.email,
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

// update user
router.patch('/:_id', (req, res, next) => {
    let updatedUser = {
        $set: {}
    };
    for (let key in req.body) {
        updatedUser[key] = req.body[key];
    }

    User.update({
            _id: req.params._id
        }, updatedUser).exec()
        .then(docs => {
            if (docs.nModified < 1) {
                return res.status(404).json({
                    count: docs.length,
                    success: false,
                    msg: 'No user found with id >> ' + req.params._id,
                    result: []
                });
            }
            res.status(200).json({
                count: docs.nModified,
                success: true,
                msg: 'User updated successfully with id > ' + req.params._id,
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

// Register
router.post('/register', (req, res, next) => {
    User.find({
            email: req.body.email
        }).exec()
        .then(users => {
            if (users.length >= 1) {
                return res.status(409).json({
                    success: false,
                    msg: 'User already exists for > ' + req.body.email,
                    result: []
                });
            } else {
                bcrypt.hash(decryptJS(req.body.password), 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            msg: err.errmsg,
                            error_details: err
                        });
                    } else {
                        var user = new User();
                        for (let key in req.body) {
                            user[key] = req.body[key];
                        }
                        user.password = hash;
                        user.registeredOn = Date.now();

                        user.save().then(result => {
                            res.status(201).json({
                                count: 1,
                                success: true,
                                msg: 'User registered successfully.',
                                result: []
                            });
                        }).catch(err => {
                            res.status(500).json({
                                success: false,
                                msg: err.errmsg,
                                error_details: err
                            });
                        });
                    }
                });
            }
        });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.find({
            email: email
        }).exec()
        .then(docs => {
            if (!docs) {
                return res.status(404).json({
                    count: docs.length,
                    success: false,
                    msg: 'No User found with email > ' + newUser.email,
                    result: []
                });
            }
            bcrypt.compare(decryptJS(password), docs[0].password, (err, isMatch) => {
                if (err) {
                    return res.status(401).json({
                        success: false,
                        msg: err.errmsg,
                        error_details: err
                    });
                }

                if (isMatch) {
                    const token = jwt.sign({
                            data: docs[0]
                        },
                        config.secret, {
                            expiresIn: '1h'
                        }
                    );
                    return res.status(200).json({
                        count: 1,
                        success: true,
                        msg: 'User authenticated for > ' + email,
                        token: encryptJS(token),
                        result: docs
                    });
                }
                res.status(401).json({
                    success: false,
                    msg: 'Wrong password',
                });
            })
        }).catch(err => {
            res.status(500).json({
                success: false,
                msg: err.message,
                error_details: err
            });
        });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    res.status(200).json({
        count: 1,
        success: true,
        msg: 'User profile fetched successfully.',
        result: req.user
    });
});

// delete by id
router.delete('/:id', (req, res, next) => {
    User.findByIdAndRemove({
            _id: req.params.id
        }).exec()
        .then(docs => {
            if (!docs) {
                return res.status(404).json({
                    count: docs.length,
                    success: false,
                    msg: 'No User found for id > ' + req.params.id,
                    result: []
                });
            }
            res.status(200).json({
                count: docs.length,
                success: true,
                msg: 'User deleted with > ' + req.params.id,
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
router.delete('/', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    User.remove({}).exec()
        .then(docs => {
            if (docs.n < 1) {
                return res.status(200).json({
                    count: docs.n,
                    success: false,
                    msg: 'No users found.',
                    result: []
                });
            }
            res.status(200).json({
                count: docs.n,
                success: true,
                msg: 'All users deleted successfully.',
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