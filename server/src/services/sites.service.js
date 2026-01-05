const prisma = require('../config/prisma');

class SitesService {
  /**
   * Get all sites with filtering and pagination
   */
  async getAllSites({ status, state, client, search, page = 1, limit = 25, sortBy = 'createdAt', order = 'desc' }) {
    const skip = (page - 1) * limit;
    const where = {};

    // Build where clause based on filters
    if (status) {
      where.status = status;
    }

    if (state) {
      where.state = state;
    }

    if (client) {
      where.client = { contains: client, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { siteLocationName: { contains: search, mode: 'insensitive' } },
        { shortName: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get total count for pagination
    const total = await prisma.site.count({ where });

    // Get sites
    const sites = await prisma.site.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { [sortBy]: order },
      include: {
        _count: {
          select: {
            shifts: true,
            employeeSites: true,
            accessCodes: true
          }
        }
      }
    });

    const totalPages = Math.ceil(total / limit);

    return {
      sites,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  /**
   * Get site by ID
   */
  async getSiteById(id) {
    const site = await prisma.site.findUnique({
      where: { id },
      include: {
        accessCodes: true,
        _count: {
          select: {
            shifts: true,
            employeeSites: true
          }
        }
      }
    });

    if (!site) {
      const error = new Error('Site not found');
      error.statusCode = 404;
      throw error;
    }

    return site;
  }

  /**
   * Create a new site
   */
  async createSite(data) {
    const site = await prisma.site.create({
      data,
      include: {
        _count: {
          select: {
            shifts: true,
            employeeSites: true,
            accessCodes: true
          }
        }
      }
    });

    return site;
  }

  /**
   * Bulk create sites
   */
  async bulkCreateSites(sitesData) {
    try {
      const results = await prisma.$transaction(async (tx) => {
        const createdSites = [];
        const errors = [];

        for (let i = 0; i < sitesData.length; i++) {
          try {
            const site = await tx.site.create({
              data: {
                ...sitesData[i],
                status: sitesData[i].status || 'ACTIVE'
              }
            });
            createdSites.push(site);
          } catch (error) {
            errors.push({
              index: i,
              site: sitesData[i],
              error: error.message
            });
          }
        }

        return { createdSites, errors };
      });

      return {
        created: results.createdSites.length,
        sites: results.createdSites,
        errors: results.errors
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a site
   */
  async updateSite(id, data) {
    // Check if site exists
    await this.getSiteById(id);

    const updatedSite = await prisma.site.update({
      where: { id },
      data,
      include: {
        accessCodes: true,
        _count: {
          select: {
            shifts: true,
            employeeSites: true
          }
        }
      }
    });

    return updatedSite;
  }

  /**
   * Delete a site
   */
  async deleteSite(id) {
    // Check if site exists
    await this.getSiteById(id);

    await prisma.site.delete({
      where: { id }
    });

    return { message: 'Site deleted successfully' };
  }

  /**
   * Get employees assigned to a site
   */
  async getSiteEmployees(siteId) {
    // Check if site exists
    await this.getSiteById(siteId);

    const employeeSites = await prisma.employeeSite.findMany({
      where: {
        siteId,
        isActive: true
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            position: true,
            department: true,
            isActive: true
          }
        }
      }
    });

    return employeeSites.map(es => ({
      ...es.employee,
      assignedAt: es.assignedAt
    }));
  }

  /**
   * Assign employees to a site
   */
  async assignEmployeesToSite(siteId, employeeIds) {
    // Check if site exists
    await this.getSiteById(siteId);

    const assignments = await prisma.$transaction(
      employeeIds.map(employeeId =>
        prisma.employeeSite.upsert({
          where: {
            employeeId_siteId: {
              employeeId,
              siteId
            }
          },
          update: {
            isActive: true
          },
          create: {
            employeeId,
            siteId,
            isActive: true
          }
        })
      )
    );

    return assignments;
  }

  /**
   * Get access codes for a site
   */
  async getAccessCodes(siteId) {
    // Check if site exists
    await this.getSiteById(siteId);

    const accessCodes = await prisma.accessCode.findMany({
      where: { siteId }
    });

    return accessCodes;
  }

  /**
   * Add access code to a site
   */
  async addAccessCode(siteId, codeData) {
    // Check if site exists
    await this.getSiteById(siteId);

    const accessCode = await prisma.accessCode.create({
      data: {
        ...codeData,
        siteId
      }
    });

    return accessCode;
  }

  /**
   * Update an access code
   */
  async updateAccessCode(siteId, codeId, data) {
    // Check if access code exists and belongs to site
    const existingCode = await prisma.accessCode.findFirst({
      where: {
        id: codeId,
        siteId
      }
    });

    if (!existingCode) {
      const error = new Error('Access code not found');
      error.statusCode = 404;
      throw error;
    }

    const updatedCode = await prisma.accessCode.update({
      where: { id: codeId },
      data
    });

    return updatedCode;
  }

  /**
   * Delete an access code
   */
  async deleteAccessCode(siteId, codeId) {
    // Check if access code exists and belongs to site
    const existingCode = await prisma.accessCode.findFirst({
      where: {
        id: codeId,
        siteId
      }
    });

    if (!existingCode) {
      const error = new Error('Access code not found');
      error.statusCode = 404;
      throw error;
    }

    await prisma.accessCode.delete({
      where: { id: codeId }
    });

    return { message: 'Access code deleted successfully' };
  }
}

module.exports = new SitesService();
