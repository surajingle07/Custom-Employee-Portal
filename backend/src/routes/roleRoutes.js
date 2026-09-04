const express = require('express');
const router = express.Router();
const { getRoles, getPermissions } = require('../controllers/roleController');
const protect = require('../middlewares/authMiddleware');

router.use(protect);
router.get('/roles', getRoles);
router.get('/permissions', getPermissions);

module.exports = router;
