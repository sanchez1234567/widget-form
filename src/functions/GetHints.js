export default async function GetHints(queryData, fFetch) {
  try {
    if (queryData.length >= 1) {
      const strFetch = await fFetch;
      return eval(strFetch);
    }
    // return fetch(
    //   "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fms_unit",
    //   {
    //     method: "POST",
    //     mode: "cors",
    //     headers: {
    //       "Content-type": "application/json",
    //       Accept: "application/json",
    //       Authorization: "Token e872e6c5ccffdb498f813d862955af8f1a4fa997",
    //     },
    //     body: JSON.stringify({ query: queryData }),
    //   }
    // )
    //   .then((res) => res.json())
    //   .then((arr) => arr.suggestions)
    //   .then((resultArr) => resultArr.map((obj) => obj.value));
  } catch (err) {
    return [];
  }
}
