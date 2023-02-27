import mongoose from "mongoose";

function db_connect(database="school"){
    return new Promise((resolve, reject)=>{
        mongoose.connect(`mongodb://localhost:27017/${database}`, {useNewUrlParser: true, useUnifiedTopology: true});

        mongoose.connection
        .once("open", resolve)
        .on("error", ()=>{
            reject(new Error("Error during connection to MongoDB!"));
        });
    });
}

export {db_connect};