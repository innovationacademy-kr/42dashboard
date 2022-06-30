import { Controller, Get, Param } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller()
export class ApiController {
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

}
