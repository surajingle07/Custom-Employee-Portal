const express = require('express');
const router = express.Router();
const { getAuditLogs } = require('../controllers/auditController');
const protect = require('../middlewares/authMiddleware');
const { verifyRole } = require('../middlewares/rbacMiddleware');

router.use(protect);
router.use(verifyRole(['Admin']));

router.get('/', getAuditLogs);

module.exports = router;
