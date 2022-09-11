const path=require('path');
const express=require('express');
const planetsRouter=require('./routes/planets/planets.router')
const launchesRouter=require('./routes/launches/launches.router')

const app = express();
app.use(express.json());

app.use('/check',()=>{
    console.log('check')
})
app.use('/planet',planetsRouter)
app.use('/launche',launchesRouter)
module.exports = app;