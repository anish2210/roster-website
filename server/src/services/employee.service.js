const prisma = require('../config/prisma');

class EmployeeService {
  /**
   * Get all employees with optional filters and pagination
   */
  async getAllEmployees(filters = {}) {
    const {
      search,
      isActive,
      department,
      position,
      page = 1,
      limit = 25,
      sortBy = 'createdAt',
      order = 'desc'
    } = filters;

    const where = {};

    // Apply filters
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true' || isActive === true;
    }

    if (department) {
      where.department = { contains: department, mode: 'insensitive' };
    }

    if (position) {
      where.position = { contains: position, mode: 'insensitive' };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { [sortBy]: order },
        include: {
          _count: {
            select: {
              shifts: true,
              employeeSites: true
            }
          }
        }
      }),
      prisma.employee.count({ where })
    ]);

    return {
      employees,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get single employee by ID
   */
  async getEmployeeById(employeeId) {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        shifts: {
          take: 10,
          orderBy: { date: 'desc' },
          include: {
            site: {
              select: {
                id: true,
                siteLocationName: true,
                shortName: true
              }
            }
          }
        },
        employeeSites: {
          include: {
            site: {
              select: {
                id: true,
                siteLocationName: true,
                shortName: true
              }
            }
          }
        },
        _count: {
          select: {
            shifts: true,
            employeeSites: true
          }
        }
      }
    });

    if (!employee) {
      const error = new Error('Employee not found');
      error.statusCode = 404;
      throw error;
    }

    return employee;
  }

  /**
   * Create a new employee
   */
  async createEmployee(data) {
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      isActive = true
    } = data;

    // Check if email already exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { email }
    });

    if (existingEmployee) {
      const error = new Error('Employee with this email already exists');
      error.statusCode = 409;
      throw error;
    }

    // Create employee
    const employee = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        position,
        department: department || null,
        isActive
      }
    });

    return employee;
  }

  /**
   * Update an employee
   */
  async updateEmployee(employeeId, data) {
    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id: employeeId }
    });

    if (!existingEmployee) {
      const error = new Error('Employee not found');
      error.statusCode = 404;
      throw error;
    }

    // If email is being updated, check for duplicates
    if (data.email && data.email !== existingEmployee.email) {
      const emailExists = await prisma.employee.findUnique({
        where: { email: data.email }
      });

      if (emailExists) {
        const error = new Error('Employee with this email already exists');
        error.statusCode = 409;
        throw error;
      }
    }

    // Build update data
    const updateData = {};
    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;
    if (data.email) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone || null;
    if (data.position) updateData.position = data.position;
    if (data.department !== undefined) updateData.department = data.department || null;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    // Update employee
    const employee = await prisma.employee.update({
      where: { id: employeeId },
      data: updateData
    });

    return employee;
  }

  /**
   * Delete an employee
   */
  async deleteEmployee(employeeId) {
    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        _count: {
          select: {
            shifts: true
          }
        }
      }
    });

    if (!employee) {
      const error = new Error('Employee not found');
      error.statusCode = 404;
      throw error;
    }

    // Check if employee has shifts
    if (employee._count.shifts > 0) {
      const error = new Error('Cannot delete employee with existing shifts. Please deactivate the employee instead.');
      error.statusCode = 409;
      throw error;
    }

    // Delete the employee
    await prisma.employee.delete({
      where: { id: employeeId }
    });

    return { message: 'Employee deleted successfully' };
  }

  /**
   * Assign employee to sites
   */
  async assignToSites(employeeId, siteIds) {
    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId }
    });

    if (!employee) {
      const error = new Error('Employee not found');
      error.statusCode = 404;
      throw error;
    }

    // Remove existing site assignments
    await prisma.employeeSite.deleteMany({
      where: { employeeId }
    });

    // Create new assignments
    const assignments = await Promise.all(
      siteIds.map(siteId =>
        prisma.employeeSite.create({
          data: {
            employeeId,
            siteId
          },
          include: {
            site: {
              select: {
                id: true,
                siteLocationName: true,
                shortName: true
              }
            }
          }
        })
      )
    );

    return assignments;
  }
}

module.exports = new EmployeeService();
