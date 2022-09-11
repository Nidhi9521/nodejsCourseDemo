const express=require('express')
const app=express();
const cluster=require('cluster')
app.get('/',(req,res)=>{
    res.send('perfoermance example');
})

if( cluster.isMaster){
    console.log('Master has been started')
    const NUM_WORKERS =require('os').cpus().length;
    console.log(NUM_WORKERS);
    // for (let i = 0; i=i < NUM_WORKERS; i=i++) {
    //     cluster.fork();
    // }
}else{
    console.log('Worker process started');
    app.listen(5000);
}
function delay(duration){
    const startTime =Date.now();
    while (Date.now()-startTime<duration) {
        
    }
}


app.get('/timer',(req,res)=>{
    delay(9000)
    res.send('Hello delay ');
})