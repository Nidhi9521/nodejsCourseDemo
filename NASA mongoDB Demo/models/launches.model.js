const axios = require('axios');
const launches = require('./launches.mongo');
const planets = require('./planets.mongo')
var latestFlightNumber = 1;

const launch = {
  flightNumber: 1,
  mission: 'Kepler Exploration X',
  rocket: 'Rocket_1',
  launchDate: new Date('May 5,2023'),
  upcoming: true,
  success: true,
  customers: ['abc', 'xyz'],
};

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {
  console.log('Downloading launch data...');
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1
          }
        },
        {
          path: 'payloads',
          select: {
            'customers': 1
          }
        }
      ]
    }
  });
  console.log(response.data.docs)
  if (response.status !== 200) {
    console.log('Problem downloading launch data');
    throw new Error('Launch data download failed');
  }
  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload) => {
      return payload['customers'];
    });

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket'].name,
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers,
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);

    await saveLaunch(launch);
    // }
  }
}
async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });
  if (firstLaunch) {
    console.log('Launch data already loaded!');
  } else {
    await populateLaunches();
  }
}

async function findLaunch(filter) {
  console.log(filter)
  const data = await launches.findOne(filter);
  console.log(`this is ${data}`)
  return await launches.findOne(filter);
}

async function existLaunchWithId(launchId) {
  return await findLaunch({ flightNumber: launchId })
}

async function getAllLaunch() {
  console.log('get launch');
  console.log(launches)
  return await launches.find({})
}

async function getAllLaunch(skip, limit) {
  return await launches.find({})
}

async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne().sort('-flightNumber');
  if (!latestLaunch) {
    return defaultFlightNumber;
  }
  return latestLaunch.flightNumber;
}

async function saveLaunch(launch) {
  await launches.updateOne({
    flightNumber: launch.flightNumber
  }, launch, {
    upsert: true
  })
}

async function schedualNewlaunch(launch) {
  const planet = await planets.findOne({
    kaplerName: launch.destination
  });

  if (!planet) {
    throw new Error('No matching found')
  }
  const newFlightNumber = await getLatestFlightNumber() + 1;
  const newLaunch = Object.assign(launch, {
    sucess: true,
    upcoming: true,
    customer: ['poi', 'uyt'],
    flightNumber: newFlightNumber
  });
  saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
  const aborted = await launches.updateOne({ flightNumber: launchId }, {
    upcoming: false,
    sucess: false
  })
  return aborted.modifiedCount === 1;
}


module.exports = {
  existLaunchWithId,
  abortLaunchById,
  getAllLaunch,
  loadLaunchData,
  schedualNewlaunch,
};