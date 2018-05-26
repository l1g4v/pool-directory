function data() {
    var apis = [];
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
