## Submit pool

To upload a pool, first you need a json with this format:

```json
{ "name": "Name","wbsite":"https://web.site", "stratums": ["stratum:312","urls:212"], "apiurl": "https://web.site/rute/to/stats/", "fee": "1.0%" }
```
the api stats on you site need to have this format

```json
{"time":1527202840,"global":{"workers":0,"hashrate":0},"algos":{"somealgo":{"workers":0,"hashrate":0,"hashrateString":"0.00 KH"}},"pools":{"somecoin":{"name":"somecoin","symbol":"SOME","algorithm":"somealgo","poolStats":{"validShares":0,"validBlocks":0,"invalidShares":0,"totalPaid":0},"blocks":{"pending":0,"confirmed":0,"orphaned":0},"workers":{},"hashrate":0,"workerCount":0,"hashrateString":"0.00 KH"}}}
```

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
 */
```

## Algorithm

Replace lyra2re2 in ```app.js``` (lines 108 and 109) with you coin algorithm (e.j somealgo)

```javascript
scriptu += `
    "end"];
    for (var x = 0; x < apis.length - 1; x++) {
        var api=apis[x];
        $.ajax({
            url: api,
            dataType: 'json',
            async: false,
            success: function (data) {
                console.log(data);
                document.getElementById(String(x)+"_h").innerHTML = data.algos.lyra2re2.hashrateString;
                document.getElementById(String(x)+"_w").innerHTML = data.algos.lyra2re2.workers;
            }
        });
    }   
}
data();
</script>`;

```

```javascript
scriptu += `
    "end"];
    for (var x = 0; x < apis.length - 1; x++) {
        var api=apis[x];
        $.ajax({
            url: api,
            dataType: 'json',
            async: false,
            success: function (data) {
                console.log(data);
                document.getElementById(String(x)+"_h").innerHTML = data.algos.somealgo.hashrateString;
                document.getElementById(String(x)+"_w").innerHTML = data.algos.somealgo.workers;
            }
        });
    }   
}
data();
</script>`;

```

## "Validate" pool

in ```validated.json``` file add the pool url website in ```pools``` array

```json
{"pools":[
    "https://web.site",
    "https://an.other.web.site"
]}
```