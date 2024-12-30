import monoose, { Model, model } from 'mongoose';

export interface IUserInfo extends Document {
  userId: string;
  userName: string;
  key0: string;
  address0: string;
  working: Boolean;
}
interface UserInfoModel extends Model<IUserInfo> {}

const userSchema = new monoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  key0: {
    type: String,
    required: false,
  },
  address0: {
    type: String,
    required: false,
  },
  working: {
    type: Boolean,
    required: false,
  },
});

const UserInfo: UserInfoModel = model<IUserInfo, UserInfoModel>(
  'user',
  userSchema
);

export default UserInfo;
