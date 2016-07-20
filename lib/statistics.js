import async from 'async';

exports.geometricMean = (items) => {
  return new Promise((resolve, reject) => {
    let n = items.length;
    let p = 1;
    async.forEach(items, (item, cb) => {
      p *= (item);
      process.nextTick(cb);
    }, (error) => {
      if(error){reject(error);}
      let gM = p**(1/n);
      resolve(gM);
    });
  });
}

exports.arithmeticMean = (items) => {
  return new Promise((resolve, reject) => {
    let n = items.length;
    let s = 0;
    async.forEach(items, (item, cb) => {
      s += (item);
      process.nextTick(cb);
    }, (error) => {
      if(error){reject(error);}
      let aM = s/n;
      resolve(aM);
    });
  });
}

exports.standardDeviation = (items, mean) => {
  return new Promise((resolve, reject) => {
    let n = items.length;
    let stdDev = 0;
    async.forEach(items, (item, cb) => {
      stdDev += (item-mean)**2;
      process.nextTick(cb);
    }, (error) => {
      if(error){reject(error);}
      stdDev = (stdDev*(1/n))**(1/2);
      resolve(stdDev);
    });
  });
}

exports.downsideDeviation = (items) => {
  return new Promise((resolve, reject) => {
    console.log(items);

  });
}
