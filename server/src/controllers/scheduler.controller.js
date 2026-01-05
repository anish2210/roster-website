const schedulerService = require('../services/scheduler.service');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Get active sites for scheduler dropdown
 * @route GET /api/scheduler/sites
 */
const getActiveSites = asyncHandler(async (req, res) => {
  const sites = await schedulerService.getActiveSites();

  res.json({
    success: true,
    data: sites
  });
});

/**
 * Get employees assigned to a site
 * @route GET /api/scheduler/sites/:id/employees
 */
const getSiteEmployees = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const employees = await schedulerService.getSiteEmployees(id);

  res.json({
    success: true,
    data: employees
  });
});

/**
 * Get shifts for a site within a date range
 * @route GET /api/scheduler/sites/:id/shifts
 */
const getSiteShifts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { startDate, endDate, employeeId, status } = req.query;

  if (!startDate || !endDate) {
    const error = new Error('startDate and endDate are required');
    error.statusCode = 400;
    throw error;
  }

  const shifts = await schedulerService.getSiteShifts(id, startDate, endDate, {
    employeeId,
    status
  });

  res.json({
    success: true,
    data: shifts
  });
});

module.exports = {
  getActiveSites,
  getSiteEmployees,
  getSiteShifts
};
