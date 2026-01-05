const express = require('express');
const router = express.Router();
const schedulerController = require('../controllers/scheduler.controller');

// Scheduler routes
router.get('/sites', schedulerController.getActiveSites);
router.get('/sites/:id/employees', schedulerController.getSiteEmployees);
router.get('/sites/:id/shifts', schedulerController.getSiteShifts);

module.exports = router;
