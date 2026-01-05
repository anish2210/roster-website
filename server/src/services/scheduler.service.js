const prisma = require('../config/prisma');

class SchedulerService {
  /**
   * Get active sites for scheduler dropdown
   * Returns only essential fields for performance
   */
  async getActiveSites() {
    const sites = await prisma.site.findMany({
      where: {
        status: 'ACTIVE'
      },
      select: {
        id: true,
        siteLocationName: true,
        shortName: true,
        defaultStartTime: true,
        defaultEndTime: true,
        defaultShiftDuration: true,
        timezone: true
      },
      orderBy: {
        shortName: 'asc'
      }
    });

    return sites;
  }

  /**
   * Get employees assigned to a site
   */
  async getSiteEmployees(siteId) {
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
            isActive: true,
            _count: {
              select: {
                shifts: true
              }
            }
          }
        }
      }
    });

    return employeeSites.map(es => ({
      ...es.employee,
      assignedAt: es.assignedAt,
      totalShifts: es.employee._count.shifts
    }));
  }

  /**
   * Get shifts for a site within a date range
   */
  async getSiteShifts(siteId, startDate, endDate, filters = {}) {
    const where = {
      siteId,
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    };

    // Apply optional filters
    if (filters.employeeId) {
      where.employeeId = filters.employeeId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    const shifts = await prisma.shift.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: true
          }
        }
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ]
    });

    return shifts;
  }
}

module.exports = new SchedulerService();
