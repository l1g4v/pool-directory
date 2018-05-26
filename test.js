var request = require("request-promise");

var st={};
function getStats(url) {
    //var request = require('request');
    var st = {};
    /*
    request({
        url: url,
        json: true
    }).then((result) => {
        var j= result;
        console.log(j);
        this.st={ worker: j.pools.ponycoin.workerCount, hashr: j.pools.ponycoin.hashrateString };
        return { worker: j.pools.ponycoin.workerCount, hashr: j.pools.ponycoin.hashrateString };        
    }).catch((err) => {
        
    });*/
    request(url, handleStats);
    //console.log(st);
    return st;
}


function getData(url) {
    // Setting URL and headers for request
    var options = {
        url: url,
        json: true
    };
    // Return new promise 
    return new Promise(function(resolve, reject) {
        // Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                //resolve(body);
                var j = body;
                resolve({ worker: j.pools.ponycoin.workerCount, hashr: j.pools.ponycoin.hashrateString });
            }
        });
    });
}

function handleStats(error, response, body){
    var j = JSON.parse(body);
    console.log(j);
    st= { worker: j.pools.ponycoin.workerCount, hashr: j.pools.ponycoin.hashrateString };

}
var x={}
getData("https://eqpool.tk/api/stats/").then((result) => {
    var j= result;
    //x={ worker: j.pools.ponycoin.workerCount, hashr: j.pools.ponycoin.hashrateString };
    console.log(j);
    
}).catch((err) => {
    
});
//console.log(x);

//console.log(getStats("https://eqpool.tk/api/stats/"));
