const express = require('express');
const router = express.Router();
const { getZohoStatus, getZohoPeople, getZohoCRM, getZohoDesk, getZohoBooks } = require('../controllers/zohoController');
const protect = require('../middlewares/authMiddleware');
const { verifyRole } = require('../middlewares/rbacMiddleware');

router.use(protect);

router.get('/status', getZohoStatus);
router.get('/people', verifyRole(['Admin', 'HR']), getZohoPeople);
router.get('/crm', verifyRole(['Admin', 'Sales']), getZohoCRM);
router.get('/desk', verifyRole(['Admin', 'Support']), getZohoDesk);
router.get('/books', verifyRole(['Admin', 'Finance']), getZohoBooks);

module.exports = router;
