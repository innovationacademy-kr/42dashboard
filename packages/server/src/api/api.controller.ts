import { Controller, Get, Param } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get()
  showBrowser() {
    console.log('hi');
    return; // this.apiService.showBrowser();
  }

  @Get('api')
  async getApi() {
    const api = await this.apiService.getApi();
    return api;
  }
}
