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

console.log(hash2String("715874.37004")[0])