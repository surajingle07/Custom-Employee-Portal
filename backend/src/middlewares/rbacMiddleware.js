const logAuditAction = require('./auditLogger');

const verifyRole = (allowedRoles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userRole = req.user.roleName || req.user.role;
    const isAllowed = allowedRoles.includes(userRole) || userRole === 'Admin';

    if (!isAllowed) {
      await logAuditAction({
        req,
        action: 'ACCESS_ATTEMPT',
        resource: req.originalUrl,
        status: 'DENIED',
        details: `Access denied for role '${userRole}' to endpoint requiring [${allowedRoles.join(', ')}]`
      });

      return res.status(403).json({
        success: false,
        message: 'Access Denied: Insufficient Role Permissions'
      });
    }

    next();
  };
};

const verifyPermission = (requiredPermission) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userPermissions = req.user.permissions || [];
    const isAllowed = userPermissions.includes(requiredPermission) || req.user.roleName === 'Admin' || req.user.role === 'Admin';

    if (!isAllowed) {
      await logAuditAction({
        req,
        action: 'PERMISSION_ATTEMPT',
        resource: req.originalUrl,
        status: 'DENIED',
        details: `Permission '${requiredPermission}' required but missing for user '${req.user.email}'`
      });

      return res.status(403).json({
        success: false,
        message: `Access Denied: Missing permission '${requiredPermission}'`
      });
    }

    next();
  };
};

module.exports = {
  verifyRole,
  verifyPermission
};
