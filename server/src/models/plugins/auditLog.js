/**
 * Audit Log Plugin
 *
 * Privacy Act Compliance: Track all data access and modifications
 *
 * Adds:
 * - createdBy, updatedBy, deletedBy fields
 * - Automatic logging of modifications
 */

const logger = require('../../utils/logger');

module.exports = function auditLogPlugin(schema) {
  // Add audit fields
  schema.add({
    createdBy: {
      type: String,
      ref: 'User',
    },
    updatedBy: {
      type: String,
      ref: 'User',
    },
    deletedBy: {
      type: String,
      ref: 'User',
    },
  });

  // Pre-save hook to track updates
  schema.pre('save', function (next) {
    if (this.isNew) {
      // Log creation
      logger.audit('DOCUMENT_CREATED', {
        collection: this.constructor.modelName,
        documentId: this._id,
        createdBy: this.createdBy,
        companyId: this.companyId,
      });
    } else if (this.isModified()) {
      // Log modification
      const modifiedFields = this.modifiedPaths();
      logger.audit('DOCUMENT_UPDATED', {
        collection: this.constructor.modelName,
        documentId: this._id,
        modifiedFields,
        updatedBy: this.updatedBy,
        companyId: this.companyId,
      });
    }
    next();
  });

  // Pre-remove hook to track deletions
  schema.pre('remove', function (next) {
    logger.audit('DOCUMENT_DELETED', {
      collection: this.constructor.modelName,
      documentId: this._id,
      deletedBy: this.deletedBy,
      companyId: this.companyId,
    });
    next();
  });
};
