import { writeFile } from 'fs';

/**
 * http 요청이나 응답으로 오는 json 객체는 너무 길어서 터미널에 출력하면 가독성 떨어짐/
 * 그래서 일단 파일에 써놓고 보거나, 파일에 쓰여진 내용을 jsonPretty 사이트에 복붙해서 보면 좋음.
 * @param filePath 파일의 절대경로나 상대경로
 * @param jsonData json data
 */
export function jsonToFile(filePath: string, jsonData: JSON) {
  writeFile(filePath, JSON.stringify(jsonData), (err) => {
    console.log(err);
  });
}
