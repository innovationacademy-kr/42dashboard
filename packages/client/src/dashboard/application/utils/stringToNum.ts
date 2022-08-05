export default function stringToUnicode(str: string): string {
  let ret = '';
  for (let i = 0; i < str.length; i++) {
    ret += str.charCodeAt(i);
  }
  return ret;
}
