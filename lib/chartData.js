import polo from 'poloniex-unofficial';
import Promise from 'bluebird';
import async from 'async';

let fs = Promise.promisifyAll(require('fs'));
let jsonfile = Promise.promisifyAll(require('jsonfile'));
let poloPublicAPI = Promise.promisifyAll(new polo.PublicWrapper());

// currencyPair, start, end, period, callback

exports.getChartData = (currencyPairs, start, end, period, dataDir) => {
  return new Promise((resolve, reject) => {
    async.forEach(currencyPairs, (pair, cb) => {
      poloPublicAPI.returnChartDataAsync(pair, start, end, period).then((chartData) => {
        return exports.saveChartData(pair, chartData, dataDir);
      }).then(() => {
        cb();
      }).catch((error) => {
        throw error;
      });
    }, (error) => {
      if(error){reject(error);}
      resolve(true);
    });
  });
}

exports.readChartData = (currencyPairs, start, end, period, dataDir) => {
  return new Promise((resolve, reject) => {
    fs.readdirAsync(dataDir).then((files) => {
      async.forEach(files, (file, cb) => {

        jsonfile.readFileAsync(`${dataDir}/${file}`).then((chartData) => {
          return exports.updateChartData(currencyPairs, file, chartData);
        }).then(() => {
          cb();
        }).catch((error) => {
          throw error;
        });

      }, (error) => {
        if(error){reject(error);}
        resolve(true);
      });
    }).catch((error) => {
      reject(error);
    });
  });
}

exports.updateChartData = (pair, chartData, dataDir) => {
  return new Promise((resolve, reject) => {

    let latestDate = chartData[chartData.length - 1]["date"];
    let period = chartData[1]["date"] - chartData[0]["date"];

    poloPublicAPI.returnChartDataAsync(pair, latestDate, 9999999999, period).then((_chartData) => {
      if(latestDate == _chartData[_chartData.length - 1]["date"]){
        console.log('Chart data already up-to-date.');
        resolve(chartData);
      } else {
        console.log(latestDate == _chartData[0]["date"]);
        chartData = chartData.concat(_chartData);
        return exports.saveChartData(pair, chartData, dataDir);
      };

    }).then((chartData) => {
      resolve(chartData);
    }).catch((error) => {
      reject(error);
    });
  });
}

exports.saveChartData = (pair, chartData, dataDir) => {
  return new Promise((resolve, reject) => {
    let fileName = `${pair}_chartData.json`;
    jsonfile.writeFileAsync(`${dataDir}/${fileName}`, chartData).then(() => {
      resolve(chartData);
    }).catch((error) => {
      reject(error);
    });
  });
}

exports.getSavedChartData = (pair, dataDir) => {
  return new Promise((resolve, reject) => {
    let file = `${pair}_chartData.json`;
    jsonfile.readFileAsync(`${dataDir}/${file}`).then((chartData) => {
      resolve(chartData);
    }).catch((error) => {
      reject(error);
    });
  });
};
