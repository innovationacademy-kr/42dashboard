/* eslint-disable prettier/prettier */
/**
 * 아래 filtersToObj(filters)함수에서 만드는 filterObj의 구조
 *    {
 *      엔터티이름:[filter객체, filter객체...],
 *      엔터티이름:[filter객체, filter객체...]
 *    }
 * 예시
 *    {
 *      User:[{entityName:User, column:"intra_no", operator:"<=", givenValue:"10"}, {...}, {...}]
 *      UserPersonalInformation:[{entityName:UserPersonalInformation, column:"gender", operator:"=", givenValue:"남"}, {...}, {...}]
 *    }
 */

function makeFromStatementRawQuery(filterObj) {
  let ret;
  let filter, column, operator, value;
  let whereStatement = '';
  if (filterObj.hasOwnProperty('user')) {
    // ret = `from (select * from "user" as u where `;
    ret = `from (select * from "user" as u `;
    for (const idx in filterObj['user']) {
      filter = filterObj['user'][idx];
      column = filter['column'];
      if (column == null || column == "null") continue;
      operator = filter['operator'];
      value = filter['givenValue'];
      whereStatement += `${(idx)=>{if (idx > 0) return ' and '; else return ' ';}}${entityAlias('user')}.${columnMapping(column)} ${operatorMapping(operator)} ${valueMapping(operator, value)} `;
    }
    if (whereStatement != '') whereStatement = 'where ' + whereStatement;
    ret += whereStatement;
    ret += `) as u`;
  }
  else ret = 'from "user" as u';
  for (const entityName in filterObj) {
    // ret = addOneSubQuery(entityName, filterObj[entityName], ret);
    ret += makeOneSubQuery(entityName, filterObj[entityName]);
  }
  return ret;
}

function makeOneSubQuery(entityName, filters) {
  if (entityName == 'user') return ' ';
  let ret = ' '
  ret += ` left join ( select distinct on (fk_user_no) * from ${entityMapping(entityName)} as ${entityAlias(entityName)}`;
  ret += makeWhereStatementRawQueryOnSubQuery(entityName, filters);
  ret += ` order by fk_user_no ASC, validate_date DESC `;
  ret += ` ) as ${entityAlias(entityName)} on ${entityAlias('user')}.intra_no=${entityAlias(entityName)}.fk_user_no `;
  return ret;
}


function makeWhereStatementRawQueryOnSubQuery(entityName, filters) {
  let whereStatement = '';
  let column, operator, value;
  for (const idx in filters) {
    const filter = filters[idx];
    column = filter['column'];
    if (column == null || column == 'NULL') continue;
    if (whereStatement != '') whereStatement += ' and ';
    operator = filter['operator'];
    value = filter['givenValue'];
    // 띄어쓰기가 곳곳에 필수적으로 들어가야함 <- white space 아스키코드로 하는게 좋을거 같긴함
    whereStatement += `${entityAlias(entityName)}.${columnMapping(column,)} ${operatorMapping(operator)} ${valueMapping(operator, value)} `;
  }
  if (whereStatement != '') whereStatement = ' where  ' + whereStatement;
  return whereStatement;
}

function makeWhereStatementRawQuery(filterObj) {
  let ret = '';
  for (const entityName in filterObj) {
    if (entityName == 'user') continue;
    if (ret != '') ret += 'and';
    ret += ` ${entityAlias(entityName)}.fk_user_no is not null `;
  }
  if (ret != '') ret = ' where ' + ret + ';';
  return ret + ';';
}

// 아래처럼하게 되면 너무 불편해짐(프론트와 상의해 봐야할듯)
function addDateRangeFiltering(entityName, startDate, endDate, accumulate = false) {
  let ret = '';
  if (accumulate) {
    ret += ` and not (${entityAlias(entityName)}.expired_date < ${startDate} or ${endDate} < ${entityAlias(entityName)}.validate_date) `;
  } else {
    ret += '';
  }
  return ret;
}

function entityMapping(entityName) {
  const dict = {
    user: 'user',
    userPersonalInformation: 'user_personal_information',
    userCourseExtension: 'user_course_extension',
    userLeaveOfAbsence: 'user_leave_of_absence',
    userBlackhole: 'user_blackhole',
    userInterruptionOfCourse: 'user_interruption_of_course',
    userLearningDataAPI: 'user_learning_data_api',
    userLoyaltyManagement: 'user_loyalty_management',
    userEmploymentStatus: 'user_employment_status',
    userHrdNetUtilizeConsent: 'user_hrd_net_utilize_consent',
    userHrdNetUtilize: 'user_hrd_net_utilize',
    userOtherEmploymentStatus: 'user_other_employment_status',
    // userEducationFundState: '지원금 관리',
    userComputationFund: 'user_computation_fund',
    userAccessCardInformation: 'user_access_card_information',
    userOtherInformation: 'user_other_information',
    userLapiscineInformation: 'user_lapiscine_information',
  };
  return dict[entityName];
}

function entityAlias(entityName) {
  const dict = {
    user: 'u',
    userPersonalInformation: 'upi',
    userCourseExtension: 'uce',
    userLeaveOfAbsence: 'uloa',
    userBlackhole: 'ub',
    userInterruptionOfCourse: 'uioc',
    userLearningDataAPI: 'ulda',
    userLoyaltyManagement: 'ulm',
    userEmploymentStatus: 'ues',
    userHrdNetUtilizeConsent: 'uhnuc',
    userHrdNetUtilize: 'uhnu',
    userOtherEmploymentStatus: 'uoes',
    // userEducationFundState: '지원금 관리',
    userComputationFund: 'ucf',
    userAccessCardInformation: 'uaci',
    userOtherInformation: 'uoi',
    userLapiscineInformation: 'uli',
  };
  return dict[entityName];
}

function columnMapping(str) {
  return str;
}

// case insensitive니까 딱히 매핑할 필요 없을듯
function operatorMapping(str) {
  return str;
}
// 대소비교, like, ilike, in, between
function valueMapping(operator, str) {
  return `'${str}'`;
}

function CamelToSnake(str) {
  return str;
}

function addOneSubQuery(entityName, filters, query) {
  if (entityName == 'user') return query;
  query += ` left join ( select distinct on (fk_user_no) * from ${entityMapping(entityName)} as ${entityAlias(entityName)}`;
  query += makeWhereStatementRawQueryOnSubQuery(entityName, filters);
  query += ` order by fk_user_no, validate_date`;
  query += ` ) as ${entityAlias(entityName)} on ${entityAlias('user')}.intra_no=${entityAlias(entityName)}.fk_user_no `;
  return query;
}

function makeWhereStatementRawQuery_BEFORE(filterObj) {
  let column, operator, value;
  let ret = '';
  for (const entityName in filterObj) {
    const table = entityMapping(entityName);
    for (const idx in filterObj[entityName]) {
      const filter = filterObj[entityName][idx];
      column = filter['column'];
      if (column == null || column == 'NULL') continue;
      operator = filter['operator'];
      value = filter['givenValue'];
      // 띄어쓰기가 곳곳에 필수적으로 들어가야함 <- white space 아스키코드로 하는게 좋을거 같긴함
      ret += `${entityAlias(entityName)}.${columnMapping(column,)} ${operatorMapping(operator)} ${valueMapping(operator, value)} `;
    }
  }
  if (ret != '') ret = 'where ' + ret + ';';
  return ret; //마지막에 세미콜론 넣어줘야하나?
}

function makeFromStatementRawQuery_BEFORE(filterObj) {
  let ret = 'from "user" ';
  for (const entityName in filterObj) {
    const tableName = entityMapping(entityName);
    ret =
      ret +
      // eslint-disable-next-line prettier/prettier
      ` left join ${tableName} as ${entityAlias(entityName)} on ${entityAlias(
        'user',
      )}.intra_no=${entityAlias(entityName)}.fk_user_no `;
  }
  return ret + '';
}

export {
  makeFromStatementRawQuery,
  makeWhereStatementRawQuery,
};
