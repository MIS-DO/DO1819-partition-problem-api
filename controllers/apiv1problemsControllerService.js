'use strict'

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

function formatSolution(solution, solutionTime, problem, id) {
  var stats = {
    "solvingTime" : solutionTime
  }
  
  var formattedSolution = {
    "id": id,
    "problem": problem,
    "solution": {
      "conjunto1": [],
      "conjunto2": [],
      "suma1": 0,
      "suma2": 0,
      "stats": stats
    }
  };

  formattedSolution.solution.conjunto1 = solution[0];
  formattedSolution.solution.conjunto2 = solution[1];
  formattedSolution.solution.suma1 = sumaElemsArray(solution[0]);
  formattedSolution.solution.suma2 = sumaElemsArray(solution[1]);

  return formattedSolution;
}

module.exports.newProblem = function newProblem(req, res, next) {
  var problemRequest = req.problem.value;

  var problemId = problemRequest.id;
  var problem = problemRequest.problem;
  var arraySolution = [];
  
  // var problemResponse = {
  //   "id": problemId,
  //   "problem": problem,
  //   "solution": {
  //     "conjunto1": [],
  //     "conjunto2": [],
  //     "suma1": 0,
  //     "suma2": 0,
  //     "stats": {
  //       "solvingTime": 0
  //     }
  //   }
  // };

  var beginHR = process.hrtime()
  var begin = beginHR[0] * 1000000 + beginHR[1] / 1000;

  arraySolution = partitionProblemSolving(problem);

  var endHR = process.hrtime()
  var end = endHR[0] * 1000000 + endHR[1] / 1000;

  var solutionSolvingTime = (end - begin) / 1000;

  var problemResponse = formatSolution(arraySolution, solutionSolvingTime, problem, problemId);

  res.send(problemResponse);
};