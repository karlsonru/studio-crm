import { model, Schema, Types } from 'mongoose';

// указываем какие роли входят в эту группу ролей (группа доступа)
const schema = new Schema({
  title: { type: String, required: true, unique: true },
  roles: [{ type: Types.ObjectId, ref: 'Role' }],
});

const RolesGroup = model('RolesGroup', schema);

export { RolesGroup };
