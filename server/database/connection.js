import mongoose from 'mongoose';

import { MongoMemoryServer } from "mongodb-memory-server";

async function connect(){

    //Creating the MongoDB instance
    const mongod = await MongoMemoryServer.create();
    const getURI = mongod.getUri();

    mongoose.set('strictQuery', true);

    const db = await mongoose.connect(getURI);
    console.log("Database is connected");
    return db;

}

export default connect;