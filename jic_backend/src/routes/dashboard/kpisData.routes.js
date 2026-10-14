const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const controller = require('../../controllers/dashboard/kpisData.controller');

router.get('/', controller.getPublished);
router.get('/all', protect, controller.getAllAdmin);
router.post('/', protect, controller.createRecord);
router.post('/bulk', protect, controller.createBulk);
router.put('/:id', protect, controller.updateRecord);
router.patch('/:id/publish', protect, controller.publishRecord);
router.patch('/:id/unpublish', protect, controller.unpublishRecord);
router.delete('/:id', protect, controller.deleteRecord);

module.exports = router;  