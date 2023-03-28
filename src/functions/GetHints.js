export default async function GetHints(queryData) {
  try {
    const fetchText =
      'fetch(\n      "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fio",\n      {\n        method: "POST",\n        mode: "cors",\n        headers: {\n          "Content-type": "application/json",\n          Accept: "application/json",\n          Authorization: "Token e872e6c5ccffdb498f813d862955af8f1a4fa997",\n        },\n        body: JSON.stringify({\n          query: queryData,\n          parts: ["NAME"],\n        }),\n      }\n    )';
    const response = await eval(fetchText);
    const data = await response.json();
    const arr = await data.suggestions;
    const resultArr = await arr.map((obj) => obj.data[`name`]);
    return resultArr;
  } catch (err) {
    return [];
  }
}
