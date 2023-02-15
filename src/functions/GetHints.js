export default async function GetHints(queryData, searchData) {
  try {
    const response = await fetch(
      "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fio",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: "Token e872e6c5ccffdb498f813d862955af8f1a4fa997",
        },
        body: JSON.stringify({
          query: queryData,
          parts: [searchData.toUpperCase()],
        }),
      }
    );
    return response;
  } catch (err) {
    console.log(err);
  }
}
