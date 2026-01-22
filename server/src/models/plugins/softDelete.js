/**
 * Soft Delete Plugin
 *
 * Privacy Act Compliance: Australian privacy law requires 7-year data retention
 * Never hard delete - always use soft delete with deletedAt timestamp
 *
 * Adds:
 * - deletedAt field
 * - isDeleted virtual
 * - softDelete() method
 * - restore() method
 * - findActive() static method
 */

module.exports = function softDeletePlugin(schema) {
  // Add deletedAt field
  schema.add({
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  });

  // Add virtual for checking if deleted
  schema.virtual('isDeleted').get(function () {
    return this.deletedAt !== null;
  });

  // Instance method to soft delete
  schema.methods.softDelete = async function () {
    this.deletedAt = new Date();
    return await this.save();
  };

  // Instance method to restore
  schema.methods.restore = async function () {
    this.deletedAt = null;
    return await this.save();
  };

  // Static method to find only active (non-deleted) documents
  schema.statics.findActive = function (conditions = {}) {
    return this.find({ ...conditions, deletedAt: null });
  };

  // Static method to find including deleted
  schema.statics.findWithDeleted = function (conditions = {}) {
    return this.find(conditions);
  };

  // Override default find to exclude deleted by default
  const originalFind = schema.statics.find;
  schema.statics.find = function (conditions = {}, ...args) {
    // Don't add deletedAt filter if it's already specified
    if (conditions.deletedAt === undefined) {
      conditions.deletedAt = null;
    }
    return originalFind.call(this, conditions, ...args);
  };
};
