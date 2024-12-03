import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get('heartbeat')
  checkHealthHeartbeat() {
    return;
  }
}
