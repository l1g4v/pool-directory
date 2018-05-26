function data() {
    var apis = [];
    for (var x = 0; x < apis.lenght - 1; x++) {
        $.ajax({
            url: `${apis[x]}`,
            dataType: 'json',
            success: function (data) {
                console.log(data);
                document.getElementById(x + "_h").innerHTML = data.pools.ponycoin.hashrateString;
                document.getElementById(x + "_w").innerHTML = data.pools.ponycoin.workerCount;
            }
        });
    }
}
