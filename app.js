

var http = require('http');
var urlg = require('url');
var database = require('./pools.json');
var validated = require("./validated.json").pools;
var net = require('net');
var fs = require('fs');


function onArray(array, value) {
    for (e = 0; e < array.length; e++) {
        if (array[e] == value) return true;
    } return false;
}

function onPool(value) {
    for (e = 0; e < database.length; e++) {
        if (database[e].wbsite == value.n || database[e].wbsite == value.w) return true;
    } return false;
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
    var get = urlg.parse(req.url, true).query;


    if (get.uppool) {
        //console.log(get.uppool);
        var pool = JSON.parse(get.uppool);
        if (!(pool.name && pool.wbsite && pool.stratums && pool.apiurl && pool.fee)) {
            res.end("1");
        }
        if (onPool({ n: pool.name, w: pool.wbsite })) {
            return res.end("-1");
        }
        validPool(pool, res);
        return;

    }

    else if (get.raw) {
        res.end(JSON.stringify(database));
        return;
    }
    else {
        var origin = (request.headers.origin || "*");
        res.writeHead(200, {
            'Content-Type': 'text/html', 
            "access-control-allow-origin": origin,
        });
        var tbod = "<tbody>";
        var scriptu = `<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script><script>function data(){var apis=[`
        var resulth = `<!DOCTYPE html>
        <html lang="en">        
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta name="description" content="">
          <meta name="author" content="">
          <title>Mining Pools</title>
          </head>
          <body onload="document.getElementById('hrate').click();" class="text-center">
          <h2>pools directory</h2><div class="container">
          <i class="fas fa-check-circle" style="color: rgb(6, 219, 34)"></i> Verified pools<br>
          <input type="text" id="sinput" onkeyup="filterr()" placeholder="Search by name..." title="type"><br>
          <table data-sortable="" data-sortable-initialized="true" class="table" id="table"> <thead> <tr> <th data-sorted="false">Name</th> <th data-sorted="false">Stratum urls</th> <th id="hrate" data-sorted="true" data-sorted-direction="descending">Hashrate</th> <th data-sorted="false">Workers</th> <th data-sorted="false">Fee</th> </tr> </thead>`;

        for (var p = 0; p < database.length; p++) {
            tbod += "<tr>";
            scriptu += `"${database[p].apiurl}",`;
            if (onArray(validated, database[p].wbsite)) {
                tbod += `<td>${database[p].name}<br><a href="${database[p].wbsite}">${database[p].wbsite}</a><i class="fas fa-check-circle" style="color: rgb(6, 219, 34)"></i></td>`;
            } else {
                tbod += `<td>${database[p].name}<br><a href="${database[p].wbsite}">${database[p].wbsite}</a></td>`;
            }

            tbod += '<td>';
            for (var s = 0; s < database[p].stratums.length; s++) {
                if (database[p].stratums[s] !== "")
                    tbod += `<code>stratum+tcp://${database[p].stratums[s]}</code><br>`;
            }
            tbod += '</td>';
            tbod += `<td id="${p}_h">null</td>
                                <td id="${p}_w">$null</td>
                                <td>${database[p].fee}</td>
                                </tr>`;
            tbod += "</tr>";

        }
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

        resulth += `${tbod}</tbody></table></div></body>
        ${scriptu}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49"
        crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js" integrity="sha384-smHYKdLADwkXOn1EmN1qk/HfnUcbVRZyYmZ4qpPea6sjB/pTJ0euyQp0Mk8ck+5T"
        crossorigin="anonymous"></script>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB"
        crossorigin="anonymous">
        <script> function filterr() { var input, filter, table, tr, td, i; input = document.getElementById("sinput"); filter = input.value.toUpperCase(); table = document.getElementById("table"); tr = table.getElementsByTagName("tr"); for (i = 0; i < tr.length; i++) { td = tr[i].getElementsByTagName("td")[0]; if (td) { if (td.innerHTML.toUpperCase().indexOf(filter) > -1) { tr[i].style.display = ""; } else { tr[i].style.display = "none"; } } } } </script>
        <style> #sinput { background-image: url('https://cdn1.iconfinder.com/data/icons/hawcons/32/698627-icon-111-search-256.png'); background-position: 10px 10px; background-repeat: no-repeat; width: 100%; font-size: 16px; padding: 12px 20px 12px 40px; border: 1px solid #ddd; margin-bottom: 12px; } </style>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">
        </html>
        `;
        console.log(tbod);
        res.end(resulth);


    }
});

function validPool(DATA, res) {
    var conn = new net.Socket();
    var PORT = parseInt(String(DATA.stratums[0]).split(":")[1]);
    var ADDR = String(DATA.stratums[0]).split(":")[0];
    try {
        conn.connect(PORT, ADDR, function () {
            console.log('connected to: ' + ADDR + ':' + PORT);
            conn.write(`{"id":"mining.authorize","method":"mining.authorize","params":["991CE29F7D7975ED789D41F7CAC03646F182BB0F","x"]}`);
            console.log(`Send validation msg`);
        });

    } catch (error) {
        res.end("-1");
    }
    conn.on('data', function (d) {
        console.log('recieved: ' + d);
        var id = JSON.parse(d).id;
        var mt = JSON.parse(d).method;
        if (id === `mining.authorize` || mt === `mining.notify`) {
            var sudb = updateDB({ name: DATA.name, wbsite: DATA.wbsite, stratums: DATA.stratums, apiurl: DATA.apiurl, fee: DATA.fee });
            if (sudb) { done = true; res.end("0"); }
            else res.end("-1");
            conn.destroy();
        }
    });

    conn.on('close', function () {
        console.log("done");
    });
};

function updateDB(value) {
    var acdb = JSON.stringify(database);
    var sdb = acdb.substring(0, acdb.length - 1);
    var nwdb = sdb + "," + JSON.stringify(value) + "]";
    database = JSON.parse(nwdb);
    try {
        fs.writeFileSync("pools.json", JSON.stringify(database));
    } catch (e) {
        return false;
    }
    return true;

}

setInterval(reloaddb, 60 * 10 * 1000);
function reloaddb() {
    validated = require('./validated.json');
    database = require('./pools.json');
}
server.listen(8089);
