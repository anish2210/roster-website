const sitesService = require('../services/sites.service');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Get all sites
 * @route GET /api/sites
 */
const getAllSites = asyncHandler(async (req, res) => {
  const { status, state, client, search, page, limit, sortBy, order } = req.query;

  const result = await sitesService.getAllSites({
    status,
    state,
    client,
    search,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 25,
    sortBy: sortBy || 'createdAt',
    order: order || 'desc'
  });

  res.json({
    success: true,
    data: result
  });
});

/**
 * Get single site by ID
 * @route GET /api/sites/:id
 */
const getSiteById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const site = await sitesService.getSiteById(id);

  res.json({
    success: true,
    data: site
  });
});

/**
 * Create a new site
 * @route POST /api/sites
 */
const createSite = asyncHandler(async (req, res) => {
  const site = await sitesService.createSite(req.body);

  res.status(201).json({
    success: true,
    data: site
  });
});

/**
 * Bulk create sites
 * @route POST /api/sites/bulk
 */
const bulkCreateSites = asyncHandler(async (req, res) => {
  const { sites } = req.body;

  const result = await sitesService.bulkCreateSites(sites);

  res.status(201).json({
    success: true,
    data: result
  });
});

/**
 * Update a site
 * @route PUT /api/sites/:id
 */
const updateSite = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const site = await sitesService.updateSite(id, req.body);

  res.json({
    success: true,
    data: site
  });
});

/**
 * Delete a site
 * @route DELETE /api/sites/:id
 */
const deleteSite = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await sitesService.deleteSite(id);

  res.json({
    success: true,
    data: result
  });
});

/**
 * Get employees assigned to a site
 * @route GET /api/sites/:id/employees
 */
const getSiteEmployees = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const employees = await sitesService.getSiteEmployees(id);

  res.json({
    success: true,
    data: employees
  });
});

/**
 * Assign employees to a site
 * @route POST /api/sites/:id/employees
 */
const assignEmployeesToSite = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { employeeIds } = req.body;

  const assignments = await sitesService.assignEmployeesToSite(id, employeeIds);

  res.status(201).json({
    success: true,
    data: assignments
  });
});

/**
 * Get access codes for a site
 * @route GET /api/sites/:id/access-codes
 */
const getAccessCodes = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const accessCodes = await sitesService.getAccessCodes(id);

  res.json({
    success: true,
    data: accessCodes
  });
});

/**
 * Add access code to a site
 * @route POST /api/sites/:id/access-codes
 */
const addAccessCode = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const accessCode = await sitesService.addAccessCode(id, req.body);

  res.status(201).json({
    success: true,
    data: accessCode
  });
});

/**
 * Update an access code
 * @route PUT /api/sites/:id/access-codes/:codeId
 */
const updateAccessCode = asyncHandler(async (req, res) => {
  const { id, codeId } = req.params;

  const accessCode = await sitesService.updateAccessCode(id, codeId, req.body);

  res.json({
    success: true,
    data: accessCode
  });
});

/**
 * Delete an access code
 * @route DELETE /api/sites/:id/access-codes/:codeId
 */
const deleteAccessCode = asyncHandler(async (req, res) => {
  const { id, codeId } = req.params;

  const result = await sitesService.deleteAccessCode(id, codeId);

  res.json({
    success: true,
    data: result
  });
});

module.exports = {
  getAllSites,
  getSiteById,
  createSite,
  bulkCreateSites,
  updateSite,
  deleteSite,
  getSiteEmployees,
  assignEmployeesToSite,
  getAccessCodes,
  addAccessCode,
  updateAccessCode,
  deleteAccessCode
};
