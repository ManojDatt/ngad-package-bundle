# Live currency exchange

> Get currency exchange rates from the European Central Bank.

## Install

```
$ npm i live-currency-exchange
```

## Usage

```js
const createExchange = require('exchange-rate');
const exchange = createExchange();
const {source, target, rate} = await exchange.convert({source: 'GBP', target: 'EUR'});
```

### Response

```json
{ source: 'GBP', target: 'EUR', rate: 1.1708 }
```