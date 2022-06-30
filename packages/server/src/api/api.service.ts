import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosResponse} from 'axios'; //????
import { raw } from 'body-parser';
import { response } from 'express';
import axios from "axios";
import { app_api, app_id, app_secret } from 'src/config/key';

@Injectable()
export class ApiService {
   // constructor(private readonly apiService: ApiService) {}

    async showBrowser() {
        return console.log("hi");
    }

    async getToken() {
        let temp;

        temp = await axios ({
            method: "post", // 요청 방식
            url: "https://api.intra.42.fr/oauth/token",
            data: {
                grant_type: "client_credentials",
                client_id: app_id,
                client_secret: app_secret,
                redirect_uri:"localhost:3000",
            }
        });
        //console.log("\n----------temp---------------\n", temp.data);
        temp = temp.data;
      //  console.log("\n---------what is toke------------\n",temp.access_token);
        return temp.access_token;
	}

    async requestApi(token){
        let temp;
        let auth_token = this.getCode();
        let page_num = 1;
        
        //  console.log("인풋인자: token", token)
        //  temp = token.get("https://api.intra.42.fr/v2/cursus_users").parsed;
       // while(page < 3) {
            temp = await axios ({
                method: "get", // 요청 방식
                //url: "https://api.intra.42.fr/v2/users/junghan",
                //url: "https://api.intra.42.fr/v2/coalitions/124/users",
                //url: "https://api.intra.42.fr/v2/users/junghan/locations_stats",
                //url: "https://api.intra.42.fr/v2/dashes/124/users",
                // url: "https://api.intra.42.fr/v2/events/124/users",
                // url: "https://api.intra.42.fr/v2/accreditations/1/users",
                //url: "https://api.intra.42.fr/v2/projects/8/users",
                //url: "https://api.intra.42.fr/v2/cursus_users/graph/on/created_at/by/month", //cursus유저 생긴 수 확인하는 듯
                url: `https://api.intra.42.fr/v2/cursus/21/cursus_users?filter[campus_id]=29&page[number]=${page_num}&page[size]=100`, 
                //url: `https://api.intra.42.fr/v2/cursus_users/?filter[campus_id]=29&page[number]=${page_num}&page[size]=100`, 
                
                headers: {
                        Authorization: `Bearer ${token}`,      
                },
            })
           // console.log(temp);
            temp = temp.data;
            
           // console.log(temp);
          //  page++;
    //   }
        //console.log("what is api",temp);
        //return temp;
        temp = await this.parsingJson(temp);
       // console.log("grade: ",temp[0]);
        return temp;
    }

    parsingDate(date): string {
        let parsed_date: string;
        let date_temp;

        if (date === null) {
            parsed_date = '9999-12-31';
            return parsed_date;
        }
        date_temp = new Date(date);
        // let year = date_temp.getUTCFullYear;
        parsed_date = `${`${date_temp.getFullYear()}-${date_temp.getMonth() + 1}-${date_temp.getDate()}`}`;
       // console.log(parsed_date);
        return parsed_date;
    }

    calculateDate(date) {
        let calculated_date;
        let date_temp;
        let today = new Date();

        if (date === null) {
            calculated_date = '9999';
            return calculated_date;
        }
        date_temp = new Date(date);
       // console.log(today.getUTCMonth());
        calculated_date = date_temp.getTime()-today.getTime();
        let second = calculated_date / 1000;
        let minute = second / 60;
        let hour = minute / 60;
        let day = hour / 24;
        calculated_date = Math.floor(day); //소수점 버리는 것
        
        // let year_to_day = (today.getUTCFullYear() - date_temp.getUTCFullYear()) * 365;
        // let month_to_day = (today.getUTCFullYear() - date_temp.getUTCFullYear()) * ;
    //    calculated_date = ((today.getUTCFullYear() - date_temp.getUTCFullYear()) * 365) + (today.getUTCFullYear() - date_temp.getUTCFullYear());
        return calculated_date;
    }

    async parsingJson(api_json){
        let temp = [];
     //   console.log(black);
        //while(api_value[i] !== null){
        for(let row in api_json) {
             temp[row] = {};
             temp[row]['level'] = api_json[row].level;
             temp[row]['email'] = api_json[row].user.email;
             temp[row]['phone'] = api_json[row].user.phone;
             temp[row]['circle'] = 9999;
             temp[row]['outercircle'] = api_json[row].grade;
             temp[row]['outercircle_date'] = null;
             temp[row]['coaltion_score'] = null;          
             temp[row]['blackhole_date'] = await this.parsingDate(api_json[row].blackholed_at)
             temp[row]['blackhole_remain_date'] = await this.calculateDate(api_json[row].blackholed_at);
        }
        console.log(temp[2].blackhole_remain_date);
        //console.log(api_json);
     //   let today = new Date();
      //  console.log(today);
     //   console.log(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`); //년과 일은 현지 시간대로 나타나지만 월같은 경우 0부터 시작, 요일도 0부터 시작
       // console.log(temp[1]['blackhole_date']);
        return temp;
    }


    async getCode():Promise<string>{    
    let temp;
    let auth_code;
            temp = await axios ({
                method: "get", // 요청 방식
                url: app_api
            });
            temp = temp.data;
    auth_code = temp.substring(temp.lastIndexOf());
    //console.log("auth_token----\n", auth_code);
    // console.log("what is code ", auth_code);
    return  auth_code;
    }


    

   async getApi() {
        let token;
        try{
            token = await this.getToken();
        }catch{
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
        return await this.requestApi(token);
    }

// //: Observable<AxiosResponse<any>>
//     async getUserById(intra_id: String) {
//         let axios = require('axios');

//         let jsonData: string; 
//         let OneRow;
//         let arr;
//         let rawData: string;
//         await axios.get("https://api.intra.42.fr/oauth/authorize?client_id=ea2e165515d03c90ddf5c01765248fa934fcbe34322b8b1c7dadac5628202128&redirect_uri=http%3A%2F%2Flocalhost&response_type=code"
//         ).then(function(response) {
//             rawData = response.data;
//          }).catch(function (err){
//          console.log(err); // 에러 처리 내용
//         });
//         return rawData;
//         console.log("response", response.json.toString);
//       //  console.log("rawdata",rawData);
//       //  return this.apiService.get();
//     }
}
