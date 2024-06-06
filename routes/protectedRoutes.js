const express = require('express');
const { getGabichat, postGabichat } = require('../controllers/mainController');
const { auth } = require('../middlewares/auth');
const upload = require('../config/multer');

const router = express.Router();

router.get('/gabichat', auth, getGabichat);
router.post('/gabichat',upload.single('image'), auth, postGabichat);

module.exports = router;
