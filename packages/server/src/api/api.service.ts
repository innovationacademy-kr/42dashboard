import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios'; //????
import { raw } from 'body-parser';
import { response } from 'express';
import axios from 'axios';
import { app_api, app_id, app_secret } from 'src/config/key';
import { json } from 'stream/consumers';
import { Api } from './entity/api.entity';
import { Repository } from 'typeorm';
import { CreateApiDto } from './dto/create-api.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { finished } from 'stream';
import { UserLearningData } from 'src/user_status/entity/user_status.entity';

@Injectable()
export class ApiService {
  // constructor(
  // //  @InjectRepository(Api)
  // //  private readonly apiRepository: Repository<Api>,
  // ) {}

  ///////////////////////////////////////////////////////////////
  /////////////////////////start get api/////////////////////////
  ///////////////////////////////////////////////////////////////
  async getApi() {
    let token;
    let api_data;
    let parsed_api;
    try {
      token = await this.getToken();
      api_data = await this.requestApi(token);
      parsed_api = await this.parsingJson(api_data);
    } catch {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return parsed_api;
  }

  async getToken() {
    let temp;

    temp = await axios({
      method: 'post', // 요청 방식
      url: 'https://api.intra.42.fr/oauth/token',
      data: {
        grant_type: 'client_credentials',
        client_id: app_id,
        client_secret: app_secret,
        redirect_uri: 'localhost:3000',
      },
    });
    //console.log("\n----------temp---------------\n", temp.data);
    temp = temp.data;
    //  console.log("\n---------what is toke------------\n",temp.access_token);
    return temp.access_token;
  }

  async requestApi(token) {
    let api_data = [];
    let page_num = 1;

    while (1) {
      const temp = await axios({
        method: 'get', // 요청 방식

        url: `https://api.intra.42.fr/v2/cursus/21/cursus_users?filter[campus_id]=29&page[number]=${page_num}&page[size]=100$sort=user_id`,
        //url: 'https://api.intra.42.fr/v2/cursus_users/117025', //cursus_id 41값인 외국인 같음 grade도 null 임
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //if (page_num == 20) console.log(temp.data[99]);

      //    console.log(page_num);
      // console.log('why ', temp.data.length);
      console.log(page_num);

      if (temp.data.length === 0) {
        //(temp.data == null || temp.data == undefined) {
        console.log('i got all data from 42api');
        break;
      }
      //console.log(temp.data.user.staff);
      //if (temp.data.user['staff?'] == true) continue;
      api_data = api_data.concat(temp.data);
      // console.log(temp.data);

      // console.log('temp---', temp.data, `@@@@@@@@@@${page_num}`);
      ++page_num;
    }
    /* console.log(
      '---------------------',
      api_data,
      `-----------------------${page_num}`,
    );*/
    //console.log(temp.data.length === 0);
    return api_data;
  }

  async parsingJson(api_data) {
    const parsed_data = [];
    let idx = 0;

    for (const row in api_data) {
      if (api_data[row].user['staff?'] == true) {
        parsed_data[idx] = {};
        parsed_data[idx]['intra_no'] = api_data[row].user.id;
        parsed_data[idx]['intra_id'] = api_data[row].user.login;
        parsed_data[idx]['level'] = api_data[row].level;
        parsed_data[idx]['email'] = api_data[row].user.email;
        parsed_data[idx]['phone_number'] = api_data[row].user.phone;
        parsed_data[idx]['circle'] = 9999;
        parsed_data[idx]['out_circle'] = api_data[row].grade;
        parsed_data[idx]['out_circle_date'] = '9999-12-31';
        parsed_data[idx]['coalition_score'] = 0;
        //parsed_data[idx]['staff'] = api_data[row].user['staff?'];
        parsed_data[idx]['blackhole_time'] = await this.parsingDate(
          api_data[row].blackholed_at,
        );
        parsed_data[idx]['remaining_period'] = await this.calculateDate(
          api_data[row].blackholed_at,
        );
        idx++;
        console.log(parsed_data);
      }
    }
    return parsed_data;
  }

  parsingDate(date): string {
    let parsed_date: string;

    if (date === null) {
      parsed_date = '9999-12-31';
      return parsed_date;
    }
    const date_temp = new Date(date);
    // let year = date_temp.getUTCFullYear;
    const year = date_temp.getFullYear();
    const tmpMonth = date_temp.getMonth() + 1;
    const tmpDay = date_temp.getDate();
    const month = tmpMonth >= 10 ? tmpMonth : '0' + tmpMonth;
    const day = tmpDay >= 10 ? tmpDay : '0' + tmpDay;
    return year + '-' + month + '-' + day;
    // parsed_date = `${`${date_temp.getFullYear()}-${
    //   date_temp.getMonth() + 1
    // }-${date_temp.getDate()}`}`;
    // // console.log(parsed_date);
    // return parsed_date;
  }

  calculateDate(date) {
    let calculated_date;

    const today = new Date();

    if (date === null) {
      calculated_date = '9999';
      return calculated_date;
    }
    const date_temp = new Date(date);
    // console.log(today.getUTCMonth());
    calculated_date = date_temp.getTime() - today.getTime();
    const second = calculated_date / 1000;
    const minute = second / 60;
    const hour = minute / 60;
    const day = hour / 24;
    calculated_date = Math.floor(day); //소수점 버리는 것
    return calculated_date;
  }

  getTupleFromApi(intra_no: number, api42s) {
    for (const api42 of api42s) {
      //console.log(api42);
      //   console.log('1', intra_no);
      // console.log('2', api42.intra_no);
      if (intra_no == api42.intra_no) {
        // console.log(`we got intra no: ${intra_no}\n`);
        return api42;
      }
    }
    console.log('cant find');
    return -1;
  }

  async parseApi(Repo, api42s) {
    const api = new UserLearningData();
    let api_tuple;
    for (const api42 of api42s) {
      console.log(api42);
      //api.intra_no = api42.id;
      api.circle = api42.circle;
      api.level = api42.level;
      api.coalition_score = api42.coalition_score;
      api.out_circle = api42.out_circle;
      api.out_circle_date = api42.out_circle_date;
      api.fk_user_no = api42.intra_no;
      api_tuple = await Repo.create(api);
      await Repo.save(api_tuple);
    }
    return 'finish';
  }

  /////////////////////////////////////////////////////////////
  /////////////////////////end get api/////////////////////////
  /////////////////////////////////////////////////////////////

  // async showBrowser() {
  //   return console.log('hi');
  // }

  // async getToken() {
  //   let temp;

  //   temp = await axios({
  //     method: 'post', // 요청 방식
  //     url: 'https://api.intra.42.fr/oauth/token',
  //     data: {
  //       grant_type: 'client_credentials',
  //       client_id: app_id,
  //       client_secret: app_secret,
  //       redirect_uri: 'localhost:3000',
  //     },
  //   });
  //   //console.log("\n----------temp---------------\n", temp.data);
  //   temp = temp.data;
  //   //  console.log("\n---------what is toke------------\n",temp.access_token);
  //   return temp.access_token;
  // }

  // async requestApi(token) {
  //   let temp;
  //   const auth_token = this.getCode();
  //   const page_num = 1;

  //   //  console.log("인풋인자: token", token)
  //   //  temp = token.get("https://api.intra.42.fr/v2/cursus_users").parsed;
  //   // while(page < 3) {
  //   temp = await axios({
  //     method: 'get', // 요청 방식
  //     //url: "https://api.intra.42.fr/v2/users/junghan",
  //     //url: "https://api.intra.42.fr/v2/coalitions/124/users",
  //     //url: "https://api.intra.42.fr/v2/users/junghan/locations_stats",
  //     //url: "https://api.intra.42.fr/v2/dashes/124/users",
  //     // url: "https://api.intra.42.fr/v2/events/124/users",
  //     // url: "https://api.intra.42.fr/v2/accreditations/1/users",
  //     //url: "https://api.intra.42.fr/v2/projects/8/users",
  //     //url: "https://api.intra.42.fr/v2/cursus_users/graph/on/created_at/by/month", //cursus유저 생긴 수 확인하는 듯
  //     url: `https://api.intra.42.fr/v2/cursus/21/cursus_users?filter[campus_id]=29&page[number]=${page_num}&page[size]=100`,
  //     //url: `https://api.intra.42.fr/v2/cursus_users/?filter[campus_id]=29&page[number]=${page_num}&page[size]=100`,

  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  //   // console.log(temp);
  //   temp = temp.data;

  //   // console.log(temp);
  //   //  page++;
  //   //   }
  //   //console.log("what is api",temp);
  //   //return temp;
  //   // console.log("grade: ",temp[0]);
  //   return temp;
  // }

  // // async inputApiInDb(api_dto) {
  // //   const api = new Api();
  // //   api.level = api_dto.level;
  // //   api.email = api_dto.email;
  // //   api.phone = api_dto.phone;
  // //   api.circle = api_dto.level;
  // //   api.outercircle = api_dto.outercircle;
  // //   api.outercircle_date = api_dto.outercircle_date;
  // //   api.coaltion_score = api_dto.coaltion_score;
  // //   api.blackhole_time = api_dto.blackhole_time;
  // //   api.remaining_period = api_dto.remaining_period;
  // //   console.log(api);
  // //   await this.apiRepository.save(api);
  // // }

  // parsingDate(date): string {
  //   let parsed_date: string;

  //   if (date === null) {
  //     parsed_date = '9999-12-31';
  //     return parsed_date;
  //   }
  //   const date_temp = new Date(date);
  //   // let year = date_temp.getUTCFullYear;
  //   parsed_date = `${`${date_temp.getFullYear()}-${
  //     date_temp.getMonth() + 1
  //   }-${date_temp.getDate()}`}`;
  //   // console.log(parsed_date);
  //   return parsed_date;
  // }

  // calculateDate(date) {
  //   let calculated_date;

  //   const today = new Date();

  //   if (date === null) {
  //     calculated_date = '9999';
  //     return calculated_date;
  //   }
  //   const date_temp = new Date(date);
  //   // console.log(today.getUTCMonth());
  //   calculated_date = date_temp.getTime() - today.getTime();
  //   const second = calculated_date / 1000;
  //   const minute = second / 60;
  //   const hour = minute / 60;
  //   const day = hour / 24;
  //   calculated_date = Math.floor(day); //소수점 버리는 것

  //   // let year_to_day = (today.getUTCFullYear() - date_temp.getUTCFullYear()) * 365;
  //   // let month_to_day = (today.getUTCFullYear() - date_temp.getUTCFullYear()) * ;
  //   //    calculated_date = ((today.getUTCFullYear() - date_temp.getUTCFullYear()) * 365) + (today.getUTCFullYear() - date_temp.getUTCFullYear());
  //   return calculated_date;
  // }

  // async parsingJson(api_data) {
  //   const parsed_data = [];
  //   const createApiDto = new CreateApiDto();

  //   //   console.log(black);
  //   //while(api_value[i] !== null){
  //   for (const row in api_data) {
  //     createApiDto['level'] = api_data[row].level;
  //     createApiDto['email'] = api_data[row].user.email;
  //     createApiDto['phone'] = api_data[row].user.phone;
  //     createApiDto['circle'] = 9999;
  //     createApiDto['out_circle'] = api_data[row].grade;
  //     createApiDto['out_circle_date'] = '9999-12-31';
  //     createApiDto['coalition_score'] = 0;
  //     createApiDto['blackhole_time'] = await this.parsingDate(
  //       api_data[row].blackholed_at,
  //     );
  //     createApiDto['remaining_period'] = await this.calculateDate(
  //       api_data[row].blackholed_at,
  //     );
  //     console.log(createApiDto);
  //     //   parsed_data[row] = await this.inputApiInDb(createApiDto);
  //   }
  //   //   parsed_data[row] = {};
  //   //   parsed_data[row]['level'] = api_data[row].level;
  //   //   parsed_data[row]['email'] = api_data[row].user.email;
  //   //   parsed_data[row]['phone'] = api_data[row].user.phone;
  //   //   parsed_data[row]['circle'] = 9999;
  //   //   parsed_data[row]['outercircle'] = api_data[row].grade;
  //   //   parsed_data[row]['outercircle_date'] = '9999-12-31';
  //   //   parsed_data[row]['coaltion_score'] = 0;
  //   //   parsed_data[row]['blackhole_date'] = await this.parsingDate(
  //   //     api_data[row].blackholed_at,
  //   //   );
  //   //   parsed_data[row]['blackhole_remain_date'] = await this.calculateDate(
  //   //     api_data[row].blackholed_at,
  //   //   );
  //   // }
  //   //console.log(temp[2].blackhole_remain_date);
  //   //console.log(api_json);
  //   //   let today = new Date();
  //   //  console.log(today);
  //   //   console.log(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`); //년과 일은 현지 시간대로 나타나지만 월같은 경우 0부터 시작, 요일도 0부터 시작
  //   // console.log(temp[1]['blackhole_date']);
  //   return parsed_data;
  // }

  // async getCode(): Promise<string> {
  //   let temp;

  //   temp = await axios({
  //     method: 'get', // 요청 방식
  //     url: app_api,
  //   });
  //   temp = temp.data;
  //   const auth_code = temp.substring(temp.lastIndexOf());
  //   //console.log("auth_token----\n", auth_code);
  //   // console.log("what is code ", auth_code);
  //   return auth_code;
  // }

  // async getApi() {
  //   let token;
  //   let api_data;
  //   let parsed_data;
  //   let response;
  //   try {
  //     token = await this.getToken();
  //     api_data = await this.requestApi(token);
  //     await this.parsingJson(api_data);
  //   } catch {
  //     throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  //   }

  //   return new Promise<string>(() => 'finish');
  // }

  // // //: Observable<AxiosResponse<any>>
  // //     async getUserById(intra_id: String) {
  // //         let axios = require('axios');

  // //         let jsonData: string;
  // //         let OneRow;
  // //         let arr;
  // //         let rawData: string;
  // //         await axios.get("https://api.intra.42.fr/oauth/authorize?client_id=ea2e165515d03c90ddf5c01765248fa934fcbe34322b8b1c7dadac5628202128&redirect_uri=http%3A%2F%2Flocalhost&response_type=code"
  // //         ).then(function(response) {
  // //             rawData = response.data;
  // //          }).catch(function (err){
  // //          console.log(err); // 에러 처리 내용
  // //         });
  // //         return rawData;
  // //         console.log("response", response.json.toString);
  // //       //  console.log("rawdata",rawData);
  // //       //  return this.apiService.get();
  // //     }
}
