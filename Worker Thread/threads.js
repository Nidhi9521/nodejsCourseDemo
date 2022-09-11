const {isMainThread,workerData,Worker}=require('worker_threads');

if(isMainThread){
    console.log(`main thread ${process.pid}`)
    new Worker(__filename,{
        workerData:[7,6,3,2]
    });
    new Worker(__filename,{
        workerData:[7,1,12,6,3,2]
    });
}else{
    console.log(`Worker ${process.pid}`);
    console.log(`${workerData} sorted is  ${workerData.sort()}`);
}