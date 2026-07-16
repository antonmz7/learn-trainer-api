import { Injectable } from '@nestjs/common';
import { version } from '../package.json';

export interface HealthResponse {
  status: 'ok';
  version: string;
  uptime: number;
}

@Injectable()
export class AppService {
  private readonly startedAt = Date.now();

  getHealth(): HealthResponse {
    return {
      status: 'ok',
      version,
      uptime: Math.floor((Date.now() - this.startedAt) / 1000),
    };
  }
}
