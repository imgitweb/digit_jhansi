const express = require('express');
const { protect } = require('../../middlewares/authMiddleware');

module.exports = (controller) => {
    const router = express.Router();
    router.get('/', controller.getPublished);
    router.get('/all', protect, controller.getAllAdmin);
    router.post('/', protect, controller.createRecord);
    router.put('/:id', protect, controller.updateRecord);
    router.patch('/:id/publish', protect, controller.publishRecord);
    router.patch('/:id/unpublish', protect, controller.unpublishRecord);
    router.delete('/:id', protect, controller.deleteRecord);
    return router;
};  