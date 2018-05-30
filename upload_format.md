## Submit pool

To upload a pool, first you need a json with this format:

```json
{ "name": "Name","wbsite":"https://web.site", "stratums": ["stratum:312","urls:212"], "apiurl": "https://web.site/rute/to/stats/", "fee": "1.0%" , "cmds":["algos.somealgo.hashrate","algos.somealgo.workers"] }
```

Edit ```"cmds":["algos.somealgo.hashrate","algos.somealgo.workers"]``` replacing with the variable that contains the pool hashrate and worker count from the json result in ```https://web.site/rute/to/stats/```

## IMPORTANT
 - the api request must be have ```"Access-Control-Allow-Origin":"<[domain] or '*'>}"``` header

Url encode you json
```
%7B%20%22name%22%3A%20%22Name%22%2C%22wbsite%22%3A%22https%3A%2F%2Fweb.site%22%2C%20%22stratums%22%3A%20%5B%22stratum%3A312%22%2C%22urls%3A212%22%5D%2C%20%22apiurl%22%3A%20%22https%3A%2F%2Fweb.site%2Frute%2Fto%2Fstats%2F%22%2C%20%22fee%22%3A%20%221.0%25%22%20%7D
```

and submit:

```
https://you.pool.doma.in/?uppool=<ENCODED_JSON>
```

The posible response codes are:

```js
/**
 * -1: error
 * 0: done
 * 1: required data
 * 2: pool connection fail
 * 3: pool already exist
 */
```

## "Validate" pool

in ```validated.json``` file add the pool url website in ```pools``` array

```json
{"pools":[
    "https://web.site",
    "https://an.other.web.site"
]}
```