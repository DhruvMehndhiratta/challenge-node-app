var http = require("http");
var data = require("./data.json")
const fs = require('fs');
var moment = require("moment");
moment.suppressDeprecationWarnings = true;

onRequest = (req, res) => {
  res.writeHead(200, { "Content-type": "text/plain" });

  //removed reference sharing of data
  var arr = [...data];

  //variable used to hold keys of new IP encoutered and create an array of period according to each period across each IP
  var result = {};

  //  loop to create key value pair for a particular IP and created its 24 hour period keys along with empty array and also handled count of an particular IP
  arr.length && arr.map((item, i) => {
    if (!result[item["ip"]]) {
      result[item["ip"]] = {}
      result[item["ip"]]["count"] = 1

      //used to create 24 period for each IP
      for (let j = 0; j < 24; j++) {
        result[item["ip"]][`${j > 9 ? j : `0${j}`}:00:00 - ${j > 9 ? j : `0${j}`}:59:59`] = []
      }

      //pushing only those object whose timestamp matches any period
      for (var k in result[item["ip"]]) {
        if (k.substr(0, 2) == moment(item["timestamp"]).format("HH")) {
          result[item["ip"]][k].push(item)
        }
      }
    }

    else {
      result[item["ip"]]["count"] = ++result[item["ip"]]["count"]
      for (var k in result[item["ip"]]) {
        if (k.substr(0, 2) == moment(item["timestamp"]).format("HH")) {
          result[item["ip"]][k].push(item)
        }
      }
    }
  })

  // for loop to handle if any ip comes greater than 10 than that entry in result got deleted and else it has handled sorting of data on basis of amount and timestamp if amount of same period is equal
  for (var k in result) {
    if (result[k]["count"] > 10) {
      delete result[k];
    }
    else {
      // we have already handled case of greater than 10 ip now we need to delete that entry in object so we have deleted count key
      delete result[k].count
      for (var j in result[k]) {
        if (result[k][j].length >= 1) {
          result[k][j] = [handleSortedData(result[k][j])];
        }
      }
    }
  }

  // handling final loop over result keys to concatenate final period which has existing array length
  let finalSubsetArray = [];
  for (var k in result) {
    for (var j in result[k]) {
      if (result[k][j].length) {
        finalSubsetArray.push(result[k][j][0])
      }
    }
  }

  fs.writeFile('resultset.json', JSON.stringify(finalSubsetArray), "utf8", (err) => {
    if (err) throw err;
    console.log('Data written to file');
  });
  res.write(`Hi admin , desired final Subset is here \n ${JSON.stringify(finalSubsetArray)} \n \n and this subset array has a length of ${finalSubsetArray.length}`);
  res.end();
}

http.createServer(onRequest).listen(8000);

//FunctionName:handleSortedData
//Description:for handling same period entries , greater amount will be given high priority and if amount is equal earliest entry goes up to the call  

handleSortedData = (arr) => {
  arr.sort(function (a, b) {
    var aSize = a.amount;
    var bSize = b.amount;
    var aLow = a.timestamp;
    var bLow = b.timestamp;

    if (aSize == bSize) {
      return (moment(aLow).valueOf() < moment(bLow).valueOf()) ? 1 : -1;
    }
    else {
      return (aSize < bSize) ? -1 : 1;
    }
  });
  return arr[arr.length - 1]
}

module.exports = handleSortedData;