import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SHEET_ID2, SPREAD_END_POINT } from 'src/config/key';
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
import { endOfTable, mapObj } from './name_types/updater.name';

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

    const obj = JSON.parse(jsonData);
    const cols = obj.table.cols;
    const rows = obj.table.rows;

    for (const col in cols) {
      if (cols[col]['label'] === endOfTable[tableNum])
        index = this.parseSpread(
          cols,
          rows,
          index,
          repoArray[tableNum],
          mapObj[tableNum],
          endOfTable[++tableNum],
        );
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

  parseSpread(
    cols,
    rows,
    colIdx: number,
    Repo,
    mapObj,
    endOfTable: string,
  ): number {
    let tupleLine;
    let idx; //특정 테이블에 있는 컬럼인지 검사하는 색인
    let jdx = colIdx; //컬럼의 위치 튜플의 도메인 위치 맞춰주기 위한 색인

    for (const row of rows) {
      const tuple = {};
      jdx = colIdx; //특정 테이블의 시작에 해당하는 컬럼의 색인으로 초기화
      while (1) {
        //하나의 로우 완성
        idx = 0;
        if (cols[jdx] === undefined || cols[jdx]['label'] === endOfTable) break;
        else if (row['c'][jdx] === null) {
          tuple[`${cols[jdx]['label']}`] = null; //셀값이 null인 경우 별도의 처리
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
        }
        jdx++;
      }
      tupleLine = Repo.create(tuple);
      tupleLine['fk_user_no'] = row['c'][1]['f'];
      Repo.save(tupleLine);
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
