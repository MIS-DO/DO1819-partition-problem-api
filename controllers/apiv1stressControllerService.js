'use strict'
const v8 = require('v8');

function sumaElemsArray(arrayASumar) {
  var suma = 0;
  for (var i = 0; i < arrayASumar.length; i++) {
    suma += arrayASumar[i];
  }
  return suma;
};

function partitionProblemSolving(problem) {
  var listaEnteros = problem.listInt.sort().reverse();

  var conjuntoA = []
  var conjuntoB = []
  var solucion = [conjuntoA, conjuntoB]

  for (var i = 0; i < listaEnteros.length; i++) {
    if (sumaElemsArray(conjuntoA) < sumaElemsArray(conjuntoB)) {
      conjuntoA.push(listaEnteros[i]);
    } else {
      conjuntoB.push(listaEnteros[i]);
    }
  }

  return solucion;
};

function partitionProblemGenerator(nInt, maxInt) {
  const code = Math.floor((Math.random() * 100000) + 1);

  const NI = nInt; // Number of Items
  const WMAX = maxInt; // Maximum weight

  const problemId = "PartitionProblem" + code + "-NI" + NI + "-WM" + WMAX;

  //var problemSize = Math.floor((Math.random() * ((NI*WMAX*2)/3)) + 1);


  var conjuntoEnteros = [];

  for (var i = 0; i < NI; i++) {
    conjuntoEnteros.push(Math.floor((Math.random() * WMAX) + 1));
  }
  
  var problem = {
    idProblem: problemId,
    listInt: conjuntoEnteros
  };

  return problem;

}

module.exports.getStress = function getStress(req, res, next) {

  var initialMemUsed = process.memoryUsage().heapUsed / 1024 / 1024;

  var totalBeginHR = process.hrtime();
  var totalBegin = totalBeginHR[0] * 1000000 + totalBeginHR[1] / 1000;

  var integNumber = req.integNumber.value;
  var maxInt = req.maxInt.value;

  var heapStats = v8.getHeapStatistics();

  // Round stats to MB
  var roundedHeapStats = Object.getOwnPropertyNames(heapStats).reduce(function (map, stat) {
    map[stat] = Math.round((heapStats[stat] / 1024 / 1024) * 1000) / 1000;
    return map;
  }, {});

  var stressResponse = {
    "problem": "Partition Problem",
    "parameters": [
      {
        "id": "integNumber",
        "value": integNumber
      },
      {
        "id": "maxInt",
        "value": maxInt
      }
    ],
    "info": {
      "initialMemory": Math.round((initialMemUsed) * 1000) / 1000,
      "heapStats": roundedHeapStats
    },
    "result": {
      "stages": [{
        "id": "problemGeneration",
        "duration": -1,
        "memory": -1
      },
      {
        "id": "problemSolving",
        "duration": -1,
        "memory": -1
      }
      ],
      "total": {
        "duration": -1,
        "memory": -1
      }
    }
  };

  var stagesMap = stressResponse.result.stages.reduce(function (map, obj) {
    map[obj.id] = {
      "duration": obj.duration,
      "memory": obj.memory
    };
    return map;
  }, {});

  ///////////////// GENERATION ///////////////////

  var beginHR = process.hrtime()
  var begin = beginHR[0] * 1000000 + beginHR[1] / 1000;

  //console.time(problem+"-"+phase+"-C"); 
  var problem = partitionProblemGenerator(integNumber, maxInt); /*******/
  //console.timeEnd(problem+"-"+phase+"-C"); 

  var endHR = process.hrtime()
  var end = endHR[0] * 1000000 + endHR[1] / 1000;
  var duration = (end - begin) / 1000;
  var roundedDuration = Math.round(duration * 1000) / 1000;


  stagesMap["problemGeneration"].duration = roundedDuration;

  /////////////////////////////////////////////////

  const genMemUsed = process.memoryUsage().heapUsed / 1024 / 1024;

  stagesMap["problemGeneration"].memory = Math.round((genMemUsed - initialMemUsed) * 1000) / 1000;

  ///////////////////// SOLVING /////////////////
  var phase = "solving";
  var beginHR = process.hrtime()
  var begin = beginHR[0] * 1000000 + beginHR[1] / 1000;

  var solution = partitionProblemSolving(problem); /*******/

  var endHR = process.hrtime()
  var end = endHR[0] * 1000000 + endHR[1] / 1000;
  var duration = (end - begin) / 1000;
  var roundedDuration = Math.round(duration * 1000) / 1000;

  stagesMap["problemSolving"].duration = roundedDuration;

  var finalMemUsed = process.memoryUsage().heapUsed / 1024 / 1024;

  stagesMap["problemSolving"].memory = Math.round((finalMemUsed - genMemUsed) * 1000) / 1000;

  /////////////////////////////////////////////////

  var totalEndHR = process.hrtime()
  var totalEnd = totalEndHR[0] * 1000000 + totalEndHR[1] / 1000;
  var totalDuration = (totalEnd - totalBegin) / 1000;
  var roundedDuration = Math.round(totalDuration * 1000) / 1000;

  stressResponse.result.total.duration = roundedDuration;
  stressResponse.result.total.memory = Math.round((finalMemUsed - initialMemUsed) * 1000) / 1000;

  stressResponse.result.stages = Object.getOwnPropertyNames(stagesMap).map(stageId => {
    return {
      "id": stageId,
      "duration": stagesMap[stageId].duration,
      "memory": stagesMap[stageId].memory
    };
  });

  solution = null;
  problem = null;

  res.send(stressResponse);

};

module.exports.getStressInfo = function getStressInfo(req, res, next) {

  var os = require('os-utils');
  var si = require('systeminformation');

  si.cpu(function (cpuInfo) {
    si.mem(function (memInfo) {

      // Round mem stats to MB
      var roundedMemInfo = Object.getOwnPropertyNames(memInfo).reduce(function (map, stat) {
        map[stat] = Math.round((memInfo[stat] / 1024 / 1024) * 1000) / 1000;
        return map;
      }, {});

      var p = os.platform();

      os.cpuUsage(function (cpuUsage) {

        os.cpuFree(function (cpuFree) {

          res.send({
            "cpuUsage": cpuUsage,
            "cpuFree": cpuFree,
            "cpuCount": os.cpuCount(),
            "memInfo": roundedMemInfo,
            "freemem": Math.round((os.freemem() * 1000)) / 1000,
            "totalmem": Math.round((os.totalmem() * 1000)) / 1000,
            "freememPercentage": os.freememPercentage(),
            "cpuInfo": cpuInfo,
            "sysUptime": os.sysUptime(),
            "processUptime": os.processUptime(),
            "loadavgLast1Minute": os.loadavg(1),
            "loadavgLast5Minutes": os.loadavg(5),
            "loadavgLast15Minutes": os.loadavg(15),
            "platform": os.platform()
          });


        });
      });


    });
  });

};