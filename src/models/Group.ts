import { Schema, model } from 'mongoose';

const schema = new Schema({
  title: { type: String, required: true, unique: true },
  members: [{ type: String, ref: 'Role' }],
});

const Group = model('Group', schema);

export { Group };
