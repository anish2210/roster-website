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
        },
        site: {
          select: {
            id: true,
            siteLocationName: true,
            shortName: true
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

  /**
   * Get a single shift by ID
   */
  async getShiftById(shiftId) {
    const shift = await prisma.shift.findUnique({
      where: { id: shiftId },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            position: true
          }
        },
        site: {
          select: {
            id: true,
            siteLocationName: true,
            shortName: true
          }
        }
      }
    });

    if (!shift) {
      const error = new Error('Shift not found');
      error.statusCode = 404;
      throw error;
    }

    return shift;
  }

  /**
   * Create a new shift
   */
  async createShift(data) {
    const {
      employeeId,
      siteId,
      date,
      startTime,
      endTime,
      shiftType = 'REGULAR',
      status = 'SCHEDULED',
      notes,
      breakDuration,
      chargedToClient,
      specialShift,
      publishAndNotify,
      task,
      jobRefNo
    } = data;

    // Validate site exists
    const site = await prisma.site.findUnique({
      where: { id: siteId }
    });

    if (!site) {
      const error = new Error('Site not found');
      error.statusCode = 404;
      throw error;
    }

    // Validate employee exists if provided (can be null for open shifts)
    if (employeeId) {
      const employee = await prisma.employee.findUnique({
        where: { id: employeeId }
      });

      if (!employee) {
        const error = new Error('Employee not found');
        error.statusCode = 404;
        throw error;
      }

      // Check for shift conflicts
      const conflictingShift = await prisma.shift.findFirst({
        where: {
          employeeId,
          date: new Date(date),
          status: {
            not: 'CANCELLED'
          },
          OR: [
            {
              AND: [
                { startTime: { lte: new Date(startTime) } },
                { endTime: { gt: new Date(startTime) } }
              ]
            },
            {
              AND: [
                { startTime: { lt: new Date(endTime) } },
                { endTime: { gte: new Date(endTime) } }
              ]
            },
            {
              AND: [
                { startTime: { gte: new Date(startTime) } },
                { endTime: { lte: new Date(endTime) } }
              ]
            }
          ]
        }
      });

      if (conflictingShift) {
        const error = new Error('Employee already has a shift scheduled during this time');
        error.statusCode = 409;
        throw error;
      }
    }

    // Create shift
    const shift = await prisma.shift.create({
      data: {
        employeeId: employeeId || null,
        siteId,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        shiftType,
        status: publishAndNotify ? 'SCHEDULED' : status,
        notes: notes || null
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            position: true
          }
        },
        site: {
          select: {
            id: true,
            siteLocationName: true,
            shortName: true
          }
        }
      }
    });

    // TODO: Send notification if publishAndNotify is true

    return shift;
  }

  /**
   * Update a shift
   */
  async updateShift(shiftId, data) {
    // Check if shift exists
    const existingShift = await prisma.shift.findUnique({
      where: { id: shiftId }
    });

    if (!existingShift) {
      const error = new Error('Shift not found');
      error.statusCode = 404;
      throw error;
    }

    const {
      employeeId,
      siteId,
      date,
      startTime,
      endTime,
      shiftType,
      status,
      notes,
      breakDuration,
      chargedToClient,
      specialShift,
      task,
      jobRefNo
    } = data;

    // Validate site if provided
    if (siteId) {
      const site = await prisma.site.findUnique({
        where: { id: siteId }
      });

      if (!site) {
        const error = new Error('Site not found');
        error.statusCode = 404;
        throw error;
      }
    }

    // Validate employee if provided
    if (employeeId) {
      const employee = await prisma.employee.findUnique({
        where: { id: employeeId }
      });

      if (!employee) {
        const error = new Error('Employee not found');
        error.statusCode = 404;
        throw error;
      }

      // Check for shift conflicts (excluding current shift)
      const conflictingShift = await prisma.shift.findFirst({
        where: {
          id: { not: shiftId },
          employeeId,
          date: date ? new Date(date) : existingShift.date,
          status: {
            not: 'CANCELLED'
          },
          OR: [
            {
              AND: [
                { startTime: { lte: new Date(startTime || existingShift.startTime) } },
                { endTime: { gt: new Date(startTime || existingShift.startTime) } }
              ]
            },
            {
              AND: [
                { startTime: { lt: new Date(endTime || existingShift.endTime) } },
                { endTime: { gte: new Date(endTime || existingShift.endTime) } }
              ]
            },
            {
              AND: [
                { startTime: { gte: new Date(startTime || existingShift.startTime) } },
                { endTime: { lte: new Date(endTime || existingShift.endTime) } }
              ]
            }
          ]
        }
      });

      if (conflictingShift) {
        const error = new Error('Employee already has a shift scheduled during this time');
        error.statusCode = 409;
        throw error;
      }
    }

    // Build update data
    const updateData = {};
    if (employeeId !== undefined) updateData.employeeId = employeeId || null;
    if (siteId) updateData.siteId = siteId;
    if (date) updateData.date = new Date(date);
    if (startTime) updateData.startTime = new Date(startTime);
    if (endTime) updateData.endTime = new Date(endTime);
    if (shiftType) updateData.shiftType = shiftType;
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes || null;

    // Update shift
    const shift = await prisma.shift.update({
      where: { id: shiftId },
      data: updateData,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            position: true
          }
        },
        site: {
          select: {
            id: true,
            siteLocationName: true,
            shortName: true
          }
        }
      }
    });

    return shift;
  }

  /**
   * Delete a shift
   */
  async deleteShift(shiftId) {
    // Check if shift exists
    const shift = await prisma.shift.findUnique({
      where: { id: shiftId }
    });

    if (!shift) {
      const error = new Error('Shift not found');
      error.statusCode = 404;
      throw error;
    }

    // Delete the shift
    await prisma.shift.delete({
      where: { id: shiftId }
    });

    return { message: 'Shift deleted successfully' };
  }
}

module.exports = new SchedulerService();
