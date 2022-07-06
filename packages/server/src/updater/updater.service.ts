import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { ApiService } from 'src/api/api.service';
import { CreateApiDto } from 'src/api/dto/create-api.dto';
import { Api } from 'src/api/entity/api.entity';
import {
  app_id,
  app_secret,
  SHEET_ID2,
  SPREAD_END_POINT,
} from 'src/config/key';
import { UserAccessCardInformation } from 'src/user_information/entity/user_access_card_information.entity';
import { User } from 'src/user_information/entity/user_information.entity';
import { UserOtherInformation } from 'src/user_information/entity/user_other_information.entity';
import { UserPersonalInformation } from 'src/user_information/entity/user_personal_information.entity';
import {
  UserEmploymentAndFound,
  UserEmploymentStatus,
  UserHrdNetUtilize,
  UserInternStatus,
} from 'src/user_job/entity/user_job.entity';
import {
  UserComputationFund,
  UserEducationFundState,
} from 'src/user_payment/entity/user_payment.entity';
import {
  UserBlackhole,
  UserLapiscineInformation,
  UserLearningData,
  UserLeaveOfAbsence,
  UserProcessProgress,
  UserReasonOfBreak,
} from 'src/user_status/entity/user_status.entity';
import { Repository } from 'typeorm';
import { apiOfTable, endOfTable, mapObj } from './name_types/updater.name';

@Injectable() //총 16개의 테이블
export class UpdaterService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserPersonalInformation)
    private userPersonalRepository: Repository<UserPersonalInformation>,
    @InjectRepository(UserOtherInformation)
    private userOtherRepository: Repository<UserOtherInformation>,
    @InjectRepository(UserAccessCardInformation)
    private userAccessCardRepository: Repository<UserAccessCardInformation>,
    @InjectRepository(UserEmploymentAndFound)
    private userEmploymentAndFound: Repository<UserEmploymentAndFound>,
    @InjectRepository(UserInternStatus)
    private userInternStatus: Repository<UserInternStatus>,
    @InjectRepository(UserHrdNetUtilize)
    private userHrdNetUtilize: Repository<UserHrdNetUtilize>,
    @InjectRepository(UserEmploymentStatus)
    private userEmploymentStatus: Repository<UserEmploymentStatus>,
    @InjectRepository(UserComputationFund)
    private userComputationFund: Repository<UserComputationFund>,
    @InjectRepository(UserEducationFundState)
    private userEducationFundState: Repository<UserEducationFundState>,
    @InjectRepository(UserLearningData)
    private userLearningData: Repository<UserLearningData>,
    @InjectRepository(UserProcessProgress)
    private userProcessProgress: Repository<UserProcessProgress>,
    @InjectRepository(UserBlackhole)
    private userBlackhole: Repository<UserBlackhole>,
    @InjectRepository(UserLeaveOfAbsence)
    private userLeaveOfAbsence: Repository<UserLeaveOfAbsence>,
    @InjectRepository(UserReasonOfBreak)
    private userReasonOfBreak: Repository<UserReasonOfBreak>,
    @InjectRepository(UserLapiscineInformation)
    private userLapiscineInformation: Repository<UserLapiscineInformation>,
    private apiService: ApiService,
  ) {}

  async getAllSpread(): Promise<string> {
    let jsonData;
    let spreadData;
    let tableNum = 0;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const axios = require('axios');
    let index = 0;

    const repoArray = [
      this.userRepository,
      this.userPersonalRepository,
      this.userProcessProgress,
      this.userLeaveOfAbsence,
      this.userBlackhole,
      this.userReasonOfBreak,

      this.userOtherRepository,
      this.userLapiscineInformation,
      this.userEmploymentAndFound,
      this.userHrdNetUtilize,
      this.userEducationFundState,
      this.userComputationFund,
      this.userAccessCardRepository,
    ];

    const apiOfRepo = [this.userLearningData];

    await axios({
      method: 'get',
      url: `http://spreadsheets.google.com/tq?key=${SPREAD_END_POINT}&pub=1&gid=${SHEET_ID2}`,
    })
      .then(function (response) {
        const rawdata = response.data;

        const temp = '/*O_o*/\ngoogle.visualization.Query.setResponse(';
        const temp2 = '';
        const temp3 = ');';

        const rawdata2 = rawdata.replace(temp, temp2);
        spreadData = rawdata2.replace(temp3, temp2);
      })
      .catch(function (err) {
        console.log(err); // 에러 처리 내용
      });
    // eslint-disable-next-line prefer-const
    jsonData = spreadData;
    //console.log(jsonData, 'jsonData');
    const obj = JSON.parse(jsonData);
    const cols = obj.table.cols;
    const rows = obj.table.rows;
    const api42s = await this.apiService.getApi();

    //console.log(api42s, 'wht');
    //return api42s;

    for (const col in cols) {
      console.log(col, 'col', tableNum, 'table');
      if (cols[col]['label'] === endOfTable[tableNum])
        //tablle num 을 추가시키면서 label과 같은지 찾기, endoftable과 clos의 수가 같아서 가능
        index = await this.parseSpread(
          cols,
          rows,
          index,
          repoArray[tableNum],
          mapObj[tableNum],
          endOfTable[++tableNum],
          api42s,
        );
      //console.log("table nun" , tableNum);
    }
    for (const api_table in apiOfTable) {
      if (apiOfTable[api_table] == '학습데이터') {
        await this.apiService.parseApi(apiOfRepo[api_table], api42s);
      }
    }

    return await 'finish';
  }

  change_date(str: string): string {
    const convStr = str.replace(/. /g, '-');
    const tmp = new Date(convStr);
    const insertHyphen = (str, sub) =>
      `${str.slice(0, 4)}${sub}${str.slice(4, 6)}${sub}${str.slice(6)}`;
    if (str === convStr) return insertHyphen(str, '-');
    //생년월일에 - 추가해야함
    const year = tmp.getFullYear();
    const tmpMonth = tmp.getMonth() + 1;
    const tmpDay = tmp.getDate();
    const month = tmpMonth >= 10 ? tmpMonth : '0' + tmpMonth;
    const day = tmpDay >= 10 ? tmpDay : '0' + tmpDay;
    return year + '-' + month + '-' + day;
  }

  async parseSpread(
    cols,
    rows,
    colIdx: number,
    Repo,
    mapObj,
    endOfTable: string,
    api42s,
  ): Promise<number> {
    let tupleLine;
    let idx; //특정 테이블에 있는 컬럼인지 검사하는 색인
    let jdx = colIdx; //컬럼의 위치 튜플의 도메인 위치 맞춰주기 위한 색인
    //console.log(rows, 'rowss');
    for (const row of rows) {
      const tuple = {};
      jdx = colIdx; //특정 테이블의 시작에 해당하는 컬럼의 색인으로 초기화
      while (1) {
        if (cols[jdx] === undefined || cols[jdx]['label'] === endOfTable) {
          console.log('breaked-----');
          break;
        } else if (row['c'][jdx] === null) {
          tuple[`${cols[jdx]['label']}`] = null; //셀값이 null인 경우 별도의 처리
          console.log(tuple[`${cols[jdx]['label']}`], 'null?');
        } else if (
          (idx = this.compareColumn(cols[jdx]['label'], mapObj)) !== -1
        ) {
          if (cols[jdx]['type'] === 'date')
            //타입이 date인 경우 변환처리해줘야 db에 적용됨.
            tuple[`${mapObj[idx].dbName}`] = this.change_date(
              row['c'][jdx]['f'],
            );
          else if (row['c'][jdx]['v'] !== null)
            tuple[`${mapObj[idx].dbName}`] = row['c'][jdx]['v'];
          console.log(
            tuple[`${mapObj[idx].dbName}`],
            ` : ${mapObj[idx].dbName}`,
          );
        }
        jdx++;
      }
      //console.log('before intra', tuple, '111111111111');
      const api42 = await this.apiService.getTupleFromApi(
        //updater name이 13개 유효하므로, 총 13번 호출됨, email, phone 같은 건 해당 테이블일 때만 컬럼에 넣어주면 될듯
        row['c'][1]['f'],
        api42s,
      );
      //console.log(api42);
      tuple['email'] = api42.email;
      tuple['phone_number'] = api42.phone_number;
      tuple['remaining_period'] = api42.remaining_period;
      tuple['blackhole_time'] = api42.blackhole_time;
      //tuple['circle'] = api42.circle;
      console.log(tuple, 'tupleeee');
      tupleLine = Repo.create(tuple);
      tupleLine['fk_user_no'] = row['c'][1]['f'];
      await Repo.save(tupleLine);
    }
    return jdx;
  }

  compareColumn(label, objs): number {
    for (const obj in objs) {
      if (label === objs[obj].spName) return Number(obj);
    }
    return -1;
  }
}
