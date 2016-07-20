import polo from 'poloniex-unofficial';


const EventEmitter = require('events');
class TickerEmitter extends EventEmitter {};

const tickerFeed = new TickerEmitter();

let poloPushAPI = new polo.PushWrapper();

tickerFeed.on('ticker', (pair, next) => {
  poloPushAPI.ticker((error, response) => {
    if(error){
      console.log(error);
      return true;
    } else if(TickerEmitter.listenerCount(tickerFeed, 'ticker') == 0){
      return true;
    } else if(response.currencyPair.match(RegExp(pair))){
      next(response);
    };
  });
});


exports.ticker = (pair, cb) => {
  tickerFeed.emit('ticker', pair, (data) => {
    cb(data);
  });
};

exports.stop = () => {
  tickerFeed.removeAllListeners('ticker');
};
