angular.module('starter').factory('LocationsService', [ function() {

  var locationsObj = {};

  locationsObj.savedLocations = [
    {
      name : "Taguatinga",
      lat : -15.8107,
      lng : -48.0658
    },
    {
      name : "Ceilândia",
      lat : -15.8214,
      lng : -48.1142
    },
    {
      name : "Asa Sul ",
      lat : -15.8044,
      lng : -47.8949
    },
    {
      name : "Asa Norte ",
      lat : -15.7736,
      lng : -47.8861
    },
    {
      name : "SIA",
      lat : -15.8153,
      lng : -47.9586
    },
    {
      name : "Guará",
      lat : -15.8256,
      lng : -47.9840
    }

  ];

  return locationsObj;

}]);