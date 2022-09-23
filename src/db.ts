import mongoose from 'mongoose';

const { DB_LOGIN, DB_PASSWORD } = process.env;

// const baseURL = `mongodb://${DB_LOGIN}:${DB_PASSWORD}@localhost:27017/?authMechanism=DEFAULT`;
const baseURL = `mongodb://localhost:27017`;

const db = async () => await mongoose.connect(baseURL);

export { db };
