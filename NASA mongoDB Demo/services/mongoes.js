const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL


mongoose.connection.once('open', () => {
    console.log("mongo connection redy");
});

mongoose.connection.on('error', (err) => {
    console.error(`monogse error ${err}`)
})
async function mongooseConnect() {
    console.log(`mongo url ${process.env.MONGO_URL}`);
    await mongoose.connect(MONGO_URL, {
        // userNewUrlParser : true,
        // useFindAndModify : false,
        // useCreateIndex : true,
        // ussUnifieldTopology : true
    })

}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongooseConnect, mongoDisconnect
}