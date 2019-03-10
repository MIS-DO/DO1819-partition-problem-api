# Partition Problem API

## Overview
This is a Partition Problem API for stress analysis and benchmarking. 

This server was generated by the [oas-generator](https://github.com/isa-group/oas-generator) project. You can get more info about the np-complete Partition Problem in [this link](https://en.wikipedia.org/wiki/Partition_problem)

There is a **on-line demo** deployment available at: https://do1819-partition-problem-api.herokuapp.com

### Running the API using docker

If you have docker, you can use it out of the box: `docker run -p 12345:80 -d joseanteugfer/partition-problem-api` to run the container at port `12345`

### Running the server
To run the server, run:

```
npm install 
npm start
```
Then, if running in localhost, you can check the swagger UI doc portal in: `http://localhost:8080/`

### Using the API

#### Stress request

- `GET /api/v1/stress/10000/10` would generate and solve a Partition problem with 10000 integers (each of them with a random value up to 10).

will get:
```json
{
  "problem": "Partition Problem",
  "parameters": [
    {
      "id": "integNumber",
      "value": 10000
    },
    {
      "id": "maxInt",
      "value": 10
    }
  ],
  "info": {
    "initialMemory": 16.654,
    "heapStats": {
      "total_heap_size": 22.613,
      "total_heap_size_executable": 2.5,
      "total_physical_size": 19.226,
      "total_available_size": 1437.686,
      "used_heap_size": 16.657,
      "heap_size_limit": 1456.175,
      "malloced_memory": 0.008,
      "peak_malloced_memory": 2.717,
      "does_zap_garbage": 0
    }
  },
  "result": {
    "stages": [
      {
        "id": "problemGeneration",
        "duration": 4.687,
        "memory": 0.647
      },
      {
        "id": "problemSolving",
        "duration": 81.287,
        "memory": -0.41
      }
    ],
    "total": {
      "duration": 87.729,
      "memory": 0.237
    }
  }
}
```

#### Partition problem solving

In order to solve a given partition problem you should send a POST to `/api/v1/problems` endpoint: 

`POST /api/v1/problems`
```json
{
    "id": "PartitionProblem",
    "problem": {
        "idProblem": "identificadorProblema",
        "listInt": [1, 2, 3, 4]
    }
}
```
will get: 
```json
{
  "id": "PartitionProblem",
    "problem": {
        "idProblem": "identificadorProblema",
        "items": [1, 2, 3, 4]
    },
    "solution": {
    "conjunto1": [3,2],
    "conjunto2": [4,1],
    "suma1": 5,
    "suma2": 5,
    "stats": {
      "solvingTime": 0.26975799560546876
    }
  }
}
```
#### Get Info

With the endpoint `/api/v1/stress/info` you get info about the system where the api is working

will get:
```json
{
  "cpuUsage": 0.5906515580736544,
  "cpuFree": 0.3700564971751412,
  "cpuCount": 8,
  "memInfo": {
    "total": 61440.145,
    "free": 2556.34,
    "used": 58883.805,
    "active": 30513.848,
    "available": 25855.027,
    "buffcache": 28369.957,
    "swaptotal": 62463.996,
    "swapused": 208.664,
    "swapfree": 61603.383
  },
  "freemem": 2544.789,
  "totalmem": 61440.145,
  "freememPercentage": 0.04141899538022174,
  "cpuInfo": {
    "manufacturer": "Intel®",
    "brand": "Xeon® E5-2670 v2",
    "vendor": "",
    "family": "",
    "model": "",
    "stepping": "",
    "revision": "",
    "voltage": "",
    "speed": "2.50",
    "speedmin": "",
    "speedmax": "",
    "cores": 8,
    "physicalCores": 4,
    "processors": 1,
    "socket": "",
    "cache": {
      "l1d": "",
      "l1i": "",
      "l2": "",
      "l3": ""
    }
  },
  "sysUptime": 976097,
  "processUptime": 153.901,
  "loadavgLast1Minute": 5.60986328125,
  "loadavgLast5Minutes": 5.158203125,
  "loadavgLast15Minutes": 8.33349609375,
  "platform": "linux"
}
```