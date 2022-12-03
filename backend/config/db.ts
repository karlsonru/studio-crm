import mongoose from 'mongoose';

// const { DB_LOGIN, DB_PASSWORD } = process.env;
// const baseURL = `mongodb://${DB_LOGIN}:${DB_PASSWORD}@localhost:27017/?authMechanism=DEFAULT`;
const baseURL = 'mongodb://127.0.0.1:27017';

const db = async () => mongoose.connect(baseURL);

export { db };
