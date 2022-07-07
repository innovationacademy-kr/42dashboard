import { writeFile } from 'fs';

/**
 * http 요청이나 응답으로 오는 json 객체는 너무 길어서 터미널에 출력하면 가독성도 떨어짐
 * 그래서 파일에 써놓으면 복사해서 JsonPretty 사이트 붙여넣기 해서 가독성 좋게 볼수 있음.
 * @param filePath 파일의 절대경로나 상대경로
 * @param jsonData json data
 */
export function jsonToFile(filePath: string, jsonData: JSON) {
  writeFile(filePath, JSON.stringify(jsonData), (err) => {
    console.log(err);
  });
}
