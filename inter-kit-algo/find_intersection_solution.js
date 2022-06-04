
/**
 * Have the function FindIntersection(strArr) read the array of strings stored in strArr which will contain 2 elements: the first element will represent a list of comma-separated numbers sorted in ascending order, the second element will represent a second list of comma-separated numbers (also sorted). Your goal is to return a comma-separated string containing the numbers that occur in elements of strArr in sorted order. If there is no intersection, return the string false.
 */

function FindIntersection(strArr) {

     const lists = strArr.map(str => str.split(", "));
     const firstList = lists[0];
     const secondList = lists[1];


     let matchMap = {};
     let resultArr = [];

     firstList.forEach(num => matchMap[num] = true);


     secondList.forEach(num => {
          if (matchMap[num]) {
               resultArr.push(num)
          }
     })

     if (resultArr.length > 0) {
          return resultArr.join(",")
     }

     return false;

}


console.log( FindIntersection(["1, 3, 4, 7, 13", "1, 2, 4, 13, 15"]));
