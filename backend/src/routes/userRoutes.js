const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUserRole, toggleUserStatus, deleteUser } = require('../controllers/userController');
const protect = require('../middlewares/authMiddleware');
const { verifyRole } = require('../middlewares/rbacMiddleware');

router.use(protect);
router.use(verifyRole(['Admin']));

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:userId/role', updateUserRole);
router.patch('/:userId/status', toggleUserStatus);
router.delete('/:userId', deleteUser);

module.exports = router;
