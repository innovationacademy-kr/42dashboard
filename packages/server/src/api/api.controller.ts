import { Controller, Get, Param } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller()
export class ApiController {
<<<<<<< HEAD
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

  // @Get('/doyun')
  // getUserById(@Param('intra_id')intra_id: String) {
  //     console.log("ishere");
  //     return this.apiService.getUserById(intra_id);
  // }
=======
    constructor(private readonly apiService: ApiService) {}

    @Get()
    showBrowser() {
        console.log("hi");
        return ;// this.apiService.showBrowser();
    }

    @Get("api")
    async getApi() {
        let api = await this.apiService.getApi();
        return api;
    }

    // @Get('/doyun')
    // getUserById(@Param('intra_id')intra_id: String) {
    //     console.log("ishere");
    //     return this.apiService.getUserById(intra_id);
    // }

>>>>>>> ce88e66 (fix(yarn    run start를 하면 npm에서는 보지못한 에러가 발생): yarn run error)
}
