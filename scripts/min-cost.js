function getMinRange(distance, averageSpeed){
  var list = [];

for(var persons = 1;persons<=15;persons++){
  list.push(findMinCost(persons, distance, averageSpeed));
}
console.log(list);
}

var findMinCost = function (NoOfPersons, distance, averageSpeed) {
    var result = {"service":"", "minimumCost":99999};
    if (NoOfPersons < 1) {
        return result;
    }
    var i;
    if(NoOfPersons>=3){
  i=3;
    }else{
  i=NoOfPersons;
  }
    for(;i<=6 && i<=NoOfPersons;i++){
    var temp = findMin(i,distance, averageSpeed);
    var subProblem = arguments.callee(NoOfPersons*1-i, distance, averageSpeed);
    var tempCost;
    if(subProblem.minimumCost == 99999){
    tempCost=0;
    }else{
    tempCost=subProblem.minimumCost;
    }
    temp = {"service":temp.service+", "+subProblem.service, "minimumCost":temp.minimumCost+tempCost};
    if(temp.minimumCost <= result.minimumCost){
  result = temp;
  }
    }
    return result;
}
//findMinCost(10,5,20);
//findMinCost(4,5,20);
//findMinCost(9,20,200);
//findMinCost(5,2,20);
function findMin(NoOfPersons, distance, averageSpeed) {
var data = {"redcab":[{"Uber":[{"UberGo":{"size":"4","basefare":"40","costperkm":"8","costpermin":"1","minimum":"80"}},{"UberX":{"size":"4","basefare":"40","costperkm":"9","costpermin":"1","minimum":"80"}},{"UberBlack":{"size":"6","basefare":"100","costperkm":"16","costpermin":"2","minimum":"150"}}]},{"Ola":[{"OlaMini":{"size":"3","basefare":"100","fixedRate":"5","costperkm":"12"}},{"OlaSedan":{"size":"4","basefare":"120","fixedRate":"5","costperkm":"16"}},{"OlaPrime":{"size":"6","basefare":"150","fixedRate":"5","costperkm":"18","costpermin":"2"}}]},{"Taxi4Sure":[{"Taxi4sureHatchBack":{"size":"3","basefare":"49","fixedRate":"4","costperkm":"15","costpermin":"1"}},{"Taxi4sureSedan":{"size":"4","basefare":"49","fixedRate":"4","costperkm":"16","costpermin":"1"}},{"Taxi4sureSUV":{"size":"6","basefare":"150","fixedRate":"4","costperkm":"18","costpermin":"1"}}]}]};
var timeTaken = distance/averageSpeed*60;
var minCost = 999999;
var service;
var noOfCabs=9;
var costArray=new Array(noOfCabs);
var result;
var row=0;

for (i=0; i <noOfCabs; i++)
    costArray[i]=new Array(distance);

  for ( var x in data) {
    for ( var y in data[x]) {
      for ( var z in data[x][y]) {
        for ( var a in data[x][y][z]) {
          for ( var b in data[x][y][z][a]) {

                        var timeTaken = distance/averageSpeed*60;
            var temp = data[x][y][z][a][b];
            if(temp.size < NoOfPersons){
            continue;
            }
            var costPerMin = temp.costpermin*1;
            if(costPerMin){
              costPerMin = costPerMin*timeTaken;          
            }else{
            costPerMin=0;
            }
            var cost = temp.basefare*1 + temp.costperkm*distance + costPerMin*1;
                        if(temp.minimum && cost < temp.minimum){
                            cost = temp.minimum;
                        }
                        if(temp.fixedRate){ 
                            if(distance <= temp.fixedRate){
                            cost = temp.basefare*1;
                        }else{
                            cost = cost*1-temp.basefare*1;
                        }
                        }
                        if(cost < minCost){
            minCost = cost;
            service = data[x][y][z][a];               
            }
            //console.log(cost);
                    }
        }
      }
    }
  }
for (var key in service) {
  result = {"service":key, "minimumCost":minCost};
}

return result;
}

function findCabSorted(NoOfPersons, distance, averageSpeed) {
var data = {"redcab":[{"Uber":[{"UberGo":{"size":"4","basefare":"40","costperkm":"8","costpermin":"1","minimum":"80"}},{"UberX":{"size":"4","basefare":"40","costperkm":"9","costpermin":"1","minimum":"80"}},{"UberBlack":{"size":"6","basefare":"100","costperkm":"16","costpermin":"2","minimum":"150"}}]},{"Ola":[{"OlaMini":{"size":"3","basefare":"100","fixedRate":"5","costperkm":"12"}},{"OlaSedan":{"size":"4","basefare":"120","fixedRate":"5","costperkm":"16"}},{"OlaPrime":{"size":"6","basefare":"150","fixedRate":"5","costperkm":"18","costpermin":"2"}}]},{"Taxi4Sure":[{"Taxi4sureHatchBack":{"size":"3","basefare":"49","fixedRate":"4","costperkm":"15"}},{"Taxi4sureSedan":{"size":"4","basefare":"49","fixedRate":"4","costperkm":"16"}},{"Taxi4sureSUV":{"size":"6","basefare":"150","fixedRate":"4","costperkm":"18"}}]}]};
var timeTaken = distance/averageSpeed*60;
var minCost = 999999;
var service;
var noOfCabs=9;
var costArray=new Array(noOfCabs);
var result;
var row=0;
var cabArray = [];

for (i=0; i <noOfCabs; i++)
    costArray[i]=new Array(distance);

  for ( var x in data) {
    for ( var y in data[x]) {
      for ( var z in data[x][y]) {
        for ( var a in data[x][y][z]) {
          for ( var b in data[x][y][z][a]) {

                        var timeTaken = distance/averageSpeed*60;
            var temp = data[x][y][z][a][b];
            if(temp.size < NoOfPersons){
            continue;
            }
            var costPerMin = temp.costpermin*1;
            if(costPerMin){
              costPerMin = costPerMin*timeTaken;          
            }else{
            costPerMin=0;
            }
            var cost = temp.basefare*1 + temp.costperkm*distance + costPerMin*1;
                        if(temp.minimum && cost < temp.minimum){
                            cost = temp.minimum;
                        }
                        if(temp.fixedRate){ 
                            if(distance < temp.fixedRate){
                            cost = temp.basefare*1;
                        }else{
                            cost = cost*1-temp.basefare*1;
                        }
                        }
            service = data[x][y][z][a];   
            for (var key in service) {
            cabArray.push({"service":key, "Cost":cost});
            } 
                    }
        }
      }
    }
  }
cabArray.sort(function(a,b) { return parseFloat(a.Cost) - parseFloat(b.Cost) } );
console.log(cabArray);

return cabArray;
}
