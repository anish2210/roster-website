const express = require('express');
const router = express.Router();
const schedulerController = require('../controllers/scheduler.controller');
const validate = require('../middleware/validate');
const {
  createShiftValidation,
  updateShiftValidation,
  deleteShiftValidation,
  getShiftByIdValidation
} = require('../validators/shift.validator');

// Site-related scheduler routes
router.get('/sites', schedulerController.getActiveSites);
router.get('/sites/:id/employees', schedulerController.getSiteEmployees);
router.get('/sites/:id/shifts', schedulerController.getSiteShifts);

// Shift CRUD routes
router.get('/shifts/:id', getShiftByIdValidation, validate, schedulerController.getShiftById);
router.post('/shifts', createShiftValidation, validate, schedulerController.createShift);
router.put('/shifts/:id', updateShiftValidation, validate, schedulerController.updateShift);
router.delete('/shifts/:id', deleteShiftValidation, validate, schedulerController.deleteShift);

module.exports = router;
