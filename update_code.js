function data(){
    var apis=[];
    for(var x=0;x<apis.lenght-1;x++){
        $.getJSON(apis[x], function(data) {
        document.getElementById(x+"_h").innerHTML=data.pools.ponycoin.hashrateString;
        document.getElementById(x+"_p").innerHTML=j.pools.ponycoin.workerCount;
    });
    }
}
