export default async function GetHints(queryData, fFetch) {
  try {
    const strFetch = await fFetch;
    return eval(strFetch);
    //   "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fio",
    //   {
    //     method: "POST",
    //     mode: "cors",
    //     headers: {
    //       "Content-type": "application/json",
    //       Accept: "application/json",
    //       Authorization: "Token e872e6c5ccffdb498f813d862955af8f1a4fa997",
    //     },
    //     body: JSON.stringify({ query: queryData, parts: ["NAME"] }),
    //   }
    // )
    // .then((res) => res.json())
    // .then((arr) => arr.suggestions)
    // .then((resultArr) => resultArr.map((obj) => obj.data["name"]));
  } catch (err) {
    return [];
  }
}
