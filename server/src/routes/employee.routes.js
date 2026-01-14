const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const validate = require('../middleware/validate');
const {
  createEmployeeValidation,
  updateEmployeeValidation,
  deleteEmployeeValidation,
  getEmployeeByIdValidation
} = require('../validators/employee.validator');

// Employee CRUD routes
router.get('/', employeeController.getAllEmployees);
router.get('/:id', getEmployeeByIdValidation, validate, employeeController.getEmployeeById);
router.post('/', createEmployeeValidation, validate, employeeController.createEmployee);
router.put('/:id', updateEmployeeValidation, validate, employeeController.updateEmployee);
router.delete('/:id', deleteEmployeeValidation, validate, employeeController.deleteEmployee);

// Employee site assignment
router.post('/:id/sites', employeeController.assignToSites);

module.exports = router;
