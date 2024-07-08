const express = require('express');
const router = express.Router();

const {getAllUsers, createNewUser, updateUser, deleteUser} = require('../controllers/usersController');
const verifyJwt = require('../middleware/verifyJwt');

router.use(verifyJwt);

router.route("/")
    .get(getAllUsers)
    .post(createNewUser)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;