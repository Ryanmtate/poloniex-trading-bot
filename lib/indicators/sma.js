import Statistics from '../statistics.js';
import async from 'async';

export default function SMA(options) {
  this.periods = options.periods;

  this.calculate = (items) => {
    return new Promise((resolve, reject) => {
      let periods = this.periods;
      let SMAs = new Object();

      async.forEach(periods, (period, cb) => {
        if(items.length > period){
          let averages = [];
          for (var i = 0; i < items.length - period; i++) {

            let observations = [];

            for (var j = 0; j < period; j++) {
              observations.push(Number(items[i+j]));
            };

            Statistics.arithmeticMean(observations).then((aM) => {
              averages.push(aM);

              SMAs[period] = {
                series : averages,
                last : averages[averages.length - 1]
              };

              cb();
            }).catch((error) => {
              throw error;
            });

          }
        } else {
          cb();
        };
      }, (error) => {
        if(error){reject(error)}
        if(Object.keys(SMAs).length != 0){
          resolve(SMAs);
        };
      });
    });
  }

}
