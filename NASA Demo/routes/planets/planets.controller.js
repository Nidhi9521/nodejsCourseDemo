const { loadPlanetsData,PlantentData } = require('../../models/planets.model');

async function httpGetAllPlanets(req, res) {
  return res.status(200).json(PlantentData);
}

module.exports = {
  httpGetAllPlanets,
};