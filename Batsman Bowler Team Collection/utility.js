exports.sort_array=function(arr){
    
    arr.sort(function(a,b){
        return parseInt(b.amount)-parseInt(a.amount);
    })
}