var request = require("request-promise");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var validated = require('./validated.json').pools;

var tbod = `<tbody>`;

var raw = [];

function onArray(array, value) {
    for (e = 0; e < array.length; e++) {
        if (array[e] == value) return true;
    } return false;
}

function addtovar(value) {
    tbod += value;
}

function resetbod() {
    tbod = `<tbody>`;
}

function getbod() {
    return tbod;
}

function addtoraw(val) {
    raw.push(val);
}

function resetraw() {
    raw = [];
}

function getraw() {
    return raw;
}

function procdt(result, j) {
    
    var name = result[n].name;
    var stratums = result[n].stratums;
    var fee = result[n].fee;
    addtovar('<tr>');
    if (onArray(validated, String(name).split("<br>")[0])) {
        addtovar(`<td>${name} <i class="fas fa-check-circle" style="color: rgb(6, 219, 34)"></i></td>`);
    } else {
        addtovar(`<td>${name}</td>`);
    }

    addtovar('<td>');
    for (var s = 0; s < stratums.length; s++) {
        addtovar(`<code>${stratums[s]}</code><br>`);
        //console.log(stratums[s]);
    }
    addtovar('</td>');
    addtovar(`<td>${j.pools.ponycoin.hashrateString}</td>
                                <td>${j.pools.ponycoin.workerCount}</td>
                                <td>${fee}</td>
                                </tr>`);
    //tbody += tbod;
    console.log(getbod());
    //console.log(`${name} ${stratums} ${fee} ${j.pools.ponycoin.hashrateString} ${j.pools.ponycoin.workerCount}`);
}

module.exports = {
    getBody: function () {
        var conn = MongoClient.connect(url);
        resetbod();
        conn.then(function (db) {
            db.db('pooldb').collection('pools').find({}).toArray().then(function (result) {
                if (result.length > 0) {
                    for (var n = 0; n < result.length; n++) {
                        rl = result.length;

                        request({
                            url: result[n].apiurl,
                            json: true
                        },function (error, resp, body) { 
                            procdt(result,body);
                        });
                    }

                    //console.log(tbody);


                }
            });
        }).catch(function (err) { console.log(err) });
        console.log(getbod());
        return getbod();

    },
    getPools: function () {

        resetraw();
        var conn = MongoClient.connect(url);
        conn.then(function (db) {
            db.db('pooldb').collection('pools').find({}).toArray().then(function (result) {
                if (result.length > 0) {
                    for (var n = 0; n < result.length; n++) {
                        rl = result.length;
                        var name = result[n].name;
                        var stratums = result[n].stratums;
                        var fee = result[n].fee;

                        request({
                            url: result[n].apiurl,
                            json: true
                        }).then((bod) => {
                            var j = bod;

                            var newp = [{ name: `${data.name}`, stratums: data.stratums, fee: data.fee, workers: j.pools.ponycoin.workerCount, hashrate: j.pools.ponycoin.hashrateString }]
                            addtoraw(newp);

                        }).catch((err) => {

                        });
                    }
                }
            });
        }).catch(function (err) { console.log(err) });
        return JSON.stringify(getraw());
    }
}

