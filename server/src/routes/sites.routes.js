const express = require('express');
const router = express.Router();
const sitesController = require('../controllers/sites.controller');
const validate = require('../middleware/validate');
const {
  createSiteValidation,
  updateSiteValidation,
  bulkCreateValidation,
  getSiteByIdValidation,
  deleteSiteValidation,
  assignEmployeesValidation,
  addAccessCodeValidation,
  updateAccessCodeValidation,
  deleteAccessCodeValidation
} = require('../validators/sites.validator');

// Sites CRUD routes
router.get('/', sitesController.getAllSites);
router.get('/:id', getSiteByIdValidation, validate, sitesController.getSiteById);
router.post('/', createSiteValidation, validate, sitesController.createSite);
router.post('/bulk', bulkCreateValidation, validate, sitesController.bulkCreateSites);
router.put('/:id', updateSiteValidation, validate, sitesController.updateSite);
router.delete('/:id', deleteSiteValidation, validate, sitesController.deleteSite);

// Employee assignment routes
router.get('/:id/employees', getSiteByIdValidation, validate, sitesController.getSiteEmployees);
router.post('/:id/employees', assignEmployeesValidation, validate, sitesController.assignEmployeesToSite);

// Access code routes
router.get('/:id/access-codes', getSiteByIdValidation, validate, sitesController.getAccessCodes);
router.post('/:id/access-codes', addAccessCodeValidation, validate, sitesController.addAccessCode);
router.put('/:id/access-codes/:codeId', updateAccessCodeValidation, validate, sitesController.updateAccessCode);
router.delete('/:id/access-codes/:codeId', deleteAccessCodeValidation, validate, sitesController.deleteAccessCode);

module.exports = router;
