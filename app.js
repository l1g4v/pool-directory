var http = require('http');
var urlg = require('url');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var validated = require('./validated.json');
var request = require("request-promise");
var fs = require('fs');

/*MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("pooldb");
    dbo.createCollection("pools", function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
    });
});*/

function onArray(array, value) {
    for (e = 0; e < array.length; e++) {
        if (array[e] == value) return true;
    } return false;
}

function addPool(dat) {
    var con = MongoClient.connect(url);
    var database = null;
    var res = false;
    con.then((db) => {
        database = db;
        return db.collection('pools');
    })
        .then((pools) => {
            return pools.insertOne(dat);
        })
        .then((result) => {
            console.log(result);
            database.close();
            return true;
        })
        .catch((err) => {
            console.error(err)
            return false;
        });
    return res;
}
/**
 * Response codes
 * -1: error
 * 0: done
 * 1: required data
 * 2: pool conn fail
 */
var server = http.createServer(function (req, res) {
    if (req.method === 'GET' && req.url === '/favicon.ico') {
        res.writeHead(200, { 'Content-Type': 'image/png' });
        var fileStream = fs.createReadStream("./favicon.png");
        return fileStream.pipe(res);
    }
    /*if (req.method === 'POST') {
        if (req.url === "/inbound") {
            var requestBody = '';
            req.on('data', function (data) {
                requestBody += data;
                if (requestBody.length > 1e7) {
                    res.writeHead(413, 'Request Entity Too Large', { 'Content-Type': 'text/html' });
                    res.end('<!doctype html><html><head><title>413</title></head><body>413: Request Entity Too Large</body></html>');
                }
            });
            req.on('end', function () {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                var data = JSON.parse(requestBody);
                if(!data.name && !data.url && !data.stratums && !data.fee && !data.apiurl){
                    res.end("1");
                    return;
                }
                if(!typeof data.stratums === 'array'){
                    res.end("1");
                    return;
                }
                var client = require('stratum-client');
                var stlg=data.stratums.length;
                var valids=1;
                for(var s=0;s<data.stratums.length;s++){
                    var c = client({
                        server: String(data.stratums[s]).split(":")[0],
                        port: parseInt(String(data.stratums[s]).split(":")[1]),
                        worker: "pool_directory_tester",
                        autoReconnectOnError: true,
                        onConnect: () => console.log('Connected to server'),
                        onClose: () => console.log('Connection closed'),
                        onError: (error) => res.end("2"),
                        onAuthorize: () => function(){valids++;}
                    });
                    c.shutdown();
                }
                if(valids===stlg){
                    var pol={name:`${data.name}<br>${data.url}`,stratums:data.stratums,fee:data.fee, apiurl: data.apiurl}
                    if(addPool(pol)){
                        res.end("0");
                        return;
                    }else{
                        res.end("-1");
                    return;
                    }
                }else{
                    res.end("2");
                    return;
                }
            });
        } else {
            response.writeHead(404, 'Resource Not Found', { 'Content-Type': 'text/html' });
            response.end('<!doctype html><html><head><title>404</title></head><body>404: Resource Not Found</body></html>');
        }
        return;
    }*/

    var get = urlg.parse(req.url, true).query;

    if (get.raw) {
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
                            var pol = { name: `${data.name}<br>${data.url}`, stratums: data.stratums, fee: data.fee, workers: j.pools.ponycoin.workerCount, hashrate: j.pools.ponycoin.hashrateString }
                            //console.log(`${name} ${stratums} ${fee} ${j.pools.ponycoin.hashrateString} ${j.pools.ponycoin.workerCount}`);

                            //console.log(tbod);

                        }).catch((err) => {

                        });
                    }
                } else {
                    tbod += "<tr><td>NO DATA</td><td>NO DATA</td><td>NO DATA</td><td>NO DATA</td><td>NO DATA</td></tr>";
                }
            });
        }).catch(function (err) { console.log(err) });
        return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    var tbod = "<tbody>";
    var tbody = "<span></span>";
    var resulth = `<!DOCTYPE html>
        <html lang="en">        
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta name="description" content="">
          <meta name="author" content="">
          <title>Mining Pools</title>
          </head>
          <body class="text-center">
          <h2>pools directory</h2><div class="container">
          <i class="fas fa-check-circle" style="color: rgb(6, 219, 34)"></i> Verified pools<br>
          <input type="text" id="sinput" onkeyup="filterr()" placeholder="Search by name..." title="type"><br>
          <table class="table" id="table"> <thead> <tr> <th>Name</th> <th>Stratum urls</th> <th>Hashrate</th> <th>Workers</th> <th>Fee</th> </tr> </thead>`;
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
                        tbod += '<tr>';
                        if (onArray(validated.pools, String(name).split("<br>")[0])) {
                            tbod += `<td>${name} <i class="fas fa-check-circle" style="color: rgb(6, 219, 34)"></i></td>`;
                        } else {
                            tbod += `<td>${name}</td>`;
                        }

                        tbod += '<td>';
                        for (var s = 0; s < stratums.length; s++) {
                            tbod += `<code>${stratums[s]}</code><br>`;
                            //console.log(stratums[s]);
                        }
                        tbod += '</td>';
                        tbod += `<td>${j.pools.ponycoin.hashrateString}</td>
                                <td>${j.pools.ponycoin.workerCount}</td>
                                <td>${fee}</td>
                                </tr>`;
                        tbody += tbod;
                        //console.log(tbody);
                        //console.log(`${name} ${stratums} ${fee} ${j.pools.ponycoin.hashrateString} ${j.pools.ponycoin.workerCount}`);

                    }).catch((err) => {

                    });
                }
                //console.log(tbody);
                resulth += `${tbody}</tbody></table></div></body>
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
        crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49"
        crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js" integrity="sha384-smHYKdLADwkXOn1EmN1qk/HfnUcbVRZyYmZ4qpPea6sjB/pTJ0euyQp0Mk8ck+5T"
        crossorigin="anonymous"></script>
        <script>window.jQuery || document.write('<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js">');<\/script></script>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB"
        crossorigin="anonymous">
        <script> function filterr() { var input, filter, table, tr, td, i; input = document.getElementById("sinput"); filter = input.value.toUpperCase(); table = document.getElementById("table"); tr = table.getElementsByTagName("tr"); for (i = 0; i < tr.length; i++) { td = tr[i].getElementsByTagName("td")[0]; if (td) { if (td.innerHTML.toUpperCase().indexOf(filter) > -1) { tr[i].style.display = ""; } else { tr[i].style.display = "none"; } } } } </script>
        <style> #sinput { background-image: url('https://www.w3schools.com/css/searchicon.png; background-position: 10px 10px; background-repeat: no-repeat; width: 100%; font-size: 16px; padding: 12px 20px 12px 40px; border: 1px solid #ddd; margin-bottom: 12px; } </style>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">
        </html>
        `;
                console.log(tbody);
                res.end(resulth);

            }
        });
    }).catch(function (err) { console.log(err) });

    //conn = null;

    //console.log(tbod);
    //
    //resulth = resulth.replace(/<\/?(tbody)>/g, `${tbod}</tbody>`);
    //
    //res.end();
    //res.end();


});
setInterval(reloadValid, 60 * 60 * 1000);
function reloadValid() {
    validated = require('./validated.json');
}
server.listen(8089);

/*
API stats format

 {"time":1527202840,"global":{"workers":0,"hashrate":0},"algos":{"lyra2re2":{"workers":0,"hashrate":0,"hashrateString":"0.00 KH"}},"pools":{"ponycoin":{"name":"ponycoin","symbol":"PONY","algorithm":"lyra2re2","poolStats":{"validShares":0,"validBlocks":0,"invalidShares":0,"totalPaid":0},"blocks":{"pending":0,"confirmed":0,"orphaned":0},"workers":{},"hashrate":0,"workerCount":0,"hashrateString":"0.00 KH"}}}
*/