const launches = new Map();

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

launches.set(launch.flightNumber, launch);


function existLaunchWithId(launchId) {
  return launches.has(launchId);
}

function getAllLaunch() {
  console.log('get launch');
  console.log(launches)
  return Object.fromEntries(launches);
}

function addNewLaunch(launch) {
  latestFlightNumber=latestFlightNumber+1;
console.log(launch);
  launches.set(latestFlightNumber, Object.assign(launch, {
    upcoming: true,
    sucess: true,
    customer: ['abc', 'xyz'],
    flightNumber: latestFlightNumber
  })
  );
  console.log(launches);
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.sucess = false;
  return aborted;
}


module.exports = {
  existLaunchWithId,
  abortLaunchById,
  getAllLaunch,
  addNewLaunch,
};