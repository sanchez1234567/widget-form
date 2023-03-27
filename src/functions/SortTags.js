export default function SortTags(obj) {
  let arr = Object.keys(obj);
  arr.sort();
  let sortObj = {};
  for (let indexArr = 0; indexArr < arr.length; indexArr += 1) {
    for (let key in obj) {
      if (arr[indexArr] === key) {
        sortObj = { ...sortObj, [String(key).toLowerCase()]: obj[key] };
      }
    }
  }
  return sortObj;
}
