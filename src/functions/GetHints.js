export default async function GetHints(queryData, fFetch) {
  try {
    const strFetch = fFetch;
    const response = await eval(strFetch);
    const data = await response.json();
    const arr = await data.suggestions;
    const resultArr = await arr.map((obj) => obj.data[`name`]);
    return resultArr;
  } catch (err) {
    return [];
  }
}
