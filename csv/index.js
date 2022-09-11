const parse = require('csv-parser');
const fs = require('fs');

const result = [];

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

fs.createReadStream('kepler_data.csv')
    .pipe(parse({
        comment: '#',
        columns: true,
    }))
    .on('data', (data) => {
        if (isHabitablePlanet(data)) {
            result.push(data);
        }
    }).on('error', (err) => {
        console.log(err);
    }).on('end', () => {
        console.log(result);
        console.log('done');
    })

parse()