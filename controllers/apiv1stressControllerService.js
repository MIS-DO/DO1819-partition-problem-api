'use strict'

module.exports.getStress = function getStress(req, res, next) {
  res.send({
    message: 'This is the mockup controller for getStress'
  });
};

module.exports.getStressInfo = function getStressInfo(req, res, next) {
  res.send({
    message: 'This is the mockup controller for getStressInfo'
  });
};