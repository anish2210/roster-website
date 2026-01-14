const employeeService = require('../services/employee.service');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Get all employees
 * @route GET /api/employees
 */
const getAllEmployees = asyncHandler(async (req, res) => {
  const { search, isActive, department, position, page, limit, sortBy, order } = req.query;

  const result = await employeeService.getAllEmployees({
    search,
    isActive,
    department,
    position,
    page,
    limit,
    sortBy,
    order
  });

  res.json({
    success: true,
    data: result
  });
});

/**
 * Get single employee by ID
 * @route GET /api/employees/:id
 */
const getEmployeeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const employee = await employeeService.getEmployeeById(id);

  res.json({
    success: true,
    data: employee
  });
});

/**
 * Create a new employee
 * @route POST /api/employees
 */
const createEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.createEmployee(req.body);

  res.status(201).json({
    success: true,
    data: employee,
    message: 'Employee created successfully'
  });
});

/**
 * Update an employee
 * @route PUT /api/employees/:id
 */
const updateEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const employee = await employeeService.updateEmployee(id, req.body);

  res.json({
    success: true,
    data: employee,
    message: 'Employee updated successfully'
  });
});

/**
 * Delete an employee
 * @route DELETE /api/employees/:id
 */
const deleteEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await employeeService.deleteEmployee(id);

  res.json({
    success: true,
    data: result
  });
});

/**
 * Assign employee to sites
 * @route POST /api/employees/:id/sites
 */
const assignToSites = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { siteIds } = req.body;

  const assignments = await employeeService.assignToSites(id, siteIds);

  res.status(201).json({
    success: true,
    data: assignments,
    message: 'Employee assigned to sites successfully'
  });
});

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  assignToSites
};
