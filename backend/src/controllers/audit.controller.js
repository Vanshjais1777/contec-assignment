import Audit from '../models/audit.model.js';

export const getAuditLogs = async (req, res) => {
  try {
    const logs = await Audit.find()
      .populate('taskId', 'title')
      .populate('performedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Audit logs retrieved successfully',
      logs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve audit logs', error: error.message });
  }
};
