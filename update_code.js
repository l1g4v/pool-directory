function hash2String(hash)
{
   var value = hash;

   var units = {
       "TH/s": 1000000000,
       "GH/s":  1000000,       
       "MH/s": 1000,
       "kH/s": 1,
   }

   var result = []

   for(var name in units) {
     var p =  Math.floor(value/units[name]);
     if(p == 1) result.push(" " + p + " " + name);
     if(p >= 2) result.push(" " + p + " " + name );
     value %= units[name]
   }

   return result;

}

function data() {
    var apis = [];
    var cmds= [];
    for (var x = 0; x < apis.length - 1; x++) {
        var api=apis[x];
        $.ajax({
            url: api,
            dataType: 'json',
            async: false,
            success: function (data) {
                console.log(data);
                document.getElementById(String(x)+"_h").innerHTML = hash2String(eval(`data.${cmds[x][0]}`))[0];
                document.getElementById(String(x)+"_w").innerHTML = eval(`data.${cmds[x][1]}`);
            }
        });
    }
}
