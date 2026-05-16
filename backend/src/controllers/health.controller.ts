import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { getDBStatus } from '../config/db';

interface HealthData {
  service: string;
  status: string;
  database: string;
  uptime: number;
  timestamp: string;
}

/**
 * GET /health
 * Returns service health including database connection state.
 */
export const healthCheck = (_req: Request, res: Response): void => {
  const data: HealthData = {
    service: 'loan-management-backend',
    status: 'healthy',
    database: getDBStatus(),
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };

  const response = new ApiResponse<HealthData>(
    true,
    'LMS backend is running',
    data,
  );

  res.status(200).json(response);
};
