import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import axios from 'axios';
import { app_id, app_secret } from 'src/config/key';

@Injectable()
export class ApiService {
  ///////////////////////////////////////////////////////////////
  /////////////////////////start get api/////////////////////////
  ///////////////////////////////////////////////////////////////
  async getApi() {
    let token;
    let apiData;
    let parsedApi;
    try {
      token = await this.getToken();
      apiData = await this.requestApi(token);
      parsedApi = this.parsingJson(apiData);
      return parsedApi;
    } catch {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  async getToken() {
    let temp;

    try {
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
      temp = temp.data;
    } catch {
      throw BadRequestException;
    }
    return temp.access_token;
  }

  async requestApi(token) {
    let apiData = [];
    let pageNum = 19; //cant find 발생할 수 있으니, 17정도로 줄여야됨
    const apiUrl = 'https://api.intra.42.fr';
    const apiEndPoint = 'v2/cursus/21/cursus_users';
    const filter = `filter[campus_id]=29`;
    let page = `page[number]=${pageNum}&page[size]=100`;
    const sort = 'sort=-user_id'; //작은 id 값부터 받아오는 것

    while (true) {
      try {
        const temp = await axios({
          method: 'get', // 요청 방식
          url: `${apiUrl}/${apiEndPoint}?${filter}&${page}&${sort}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (temp.data.length === 0) {
          console.log('i got all data from 42api');
          break;
        }
        apiData = apiData.concat(temp.data);
        //밖에만 선언하면 pageNum의 값이 바뀌어도 이미 선언된 page내의 pageNum 20의 값은 바뀌지 않아 계속 20번째의 page만 요청하게 됨.
        //pageNum만 따로 빼서 구성할 수 있긴 하지만, page만 따로 프로퍼티 별로 나누는것이 가독성에 더 안좋을 것같아 그렇게 하지 않음.
        page = `page[number]=${++pageNum}&page[size]=100`;
        console.log(pageNum);
      } catch {
        throw BadRequestException;
      }
    }
    return apiData;
  }

  /** parsing 끝난 json 형태
   *  {
        "intra_no": 99999,
        "intra_id": ddddd",
        "level": 0,
        "email": "ddddd@student.42seoul.kr",
        "phone_number": "hidden",
        "circle": 9999,
        "outcircle": "Learner",
        "outcircled_date": "9999-12-31",
        "coalition_score": 0,
        "staff": false,
        "blackhole_date": "2022-09-19",
        "remaining_period": 74
    },
   */
  parsingJson(api42s) {
    const parsedData = [];
    let idx = 0;

    for (const api42 of api42s) {
      if (
        api42.user['staff?'] == false &&
        api42.user.login.split('-')[0] !== 'm' //login 값이 m-**이면 멘토이므로 -로잘랐을때 첫번째 값이 m밖에 없다면 멘토라 판단.
      ) {
        parsedData[idx] = {
          ['intra_no']: api42.user.id,
          ['intra_id']: api42.user.login,
          ['level']: api42.level,
          ['email']: api42.user.email,
          ['phone_number']: api42.user.phone,
          ['circle']: 0,
          ['outcircle']: api42.grade,
          ['outcircled_date']: '9999-12-31',
          ['coalition_score']: 0,
          ['blackhole_date']: this.parsingDate(api42.blackholed_at),
        };
        idx++;
      }
    }
    return parsedData;
  }

  parsingDate(date): string {
    let parsedDate: string;

    if (date === null) {
      parsedDate = '9999-12-31';
      return parsedDate;
    }
    const dateTemp = new Date(date);
    const year = dateTemp.getFullYear();
    const tmpMonth = dateTemp.getMonth() + 1;
    const tmpDay = dateTemp.getDate();
    const month = tmpMonth >= 10 ? tmpMonth : '0' + tmpMonth;
    const day = tmpDay >= 10 ? tmpDay : '0' + tmpDay;
    return year + '-' + month + '-' + day;
  }

  //endDate가 비어서 들어오면 현재 날짜 기준 Date 객체 생성
  calculateDateDiff(startDate, endDate?) {
    let calculatedDate;
    let tempEndDate;

    if (startDate === null) {
      calculatedDate = '9999';
      return calculatedDate;
    }
    if (endDate == undefined) {
      tempEndDate = new Date();
    } else {
      tempEndDate = new Date(endDate);
    }
    //문자열로 date가 들어올 수 있으니 date 객체 생성
    const tempStartDate = new Date(startDate);
    calculatedDate = tempStartDate.getTime() - tempEndDate.getTime();
    const second = calculatedDate / 1000;
    const minute = second / 60;
    const hour = minute / 60;
    const day = hour / 24;
    calculatedDate = Math.floor(day); //소수점 버리는 것
    return calculatedDate;
  }

  getTupleFromApi(intra_no: number, api42s) {
    for (const api42 of api42s) {
      if (intra_no == api42.intra_no) {
        return api42;
      }
    }
    console.log('cant find', intra_no);
    return -1;
  }

  async parseApi(api42s) {
    const tupleArray = [];

    for (const api42 of api42s) {
      const api = {
        circle: api42.circle,
        level: api42.level,
        coalition_score: api42.coalition_score,
        outcircle: api42.outcircle,
        outcircled_date: api42.outcircled_date,
        fk_user_no: api42.intra_no,
      };
      tupleArray.push(api);
    }
    return tupleArray;
  }
  /////////////////////////////////////////////////////////////
  /////////////////////////end get api/////////////////////////
  /////////////////////////////////////////////////////////////
}
