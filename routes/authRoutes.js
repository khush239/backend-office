const express = require('express');
const router = express.Router();
const { authAdmin, getAdminProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', authAdmin);
router.route('/profile').get(protect, getAdminProfile);

module.exports = router;
