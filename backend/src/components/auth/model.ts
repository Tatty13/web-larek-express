import { model, Schema } from 'mongoose';

import utils from '../../utils';
import { Auth } from './types';
import helpersAuth from './helpers';

const userSchema = new Schema<Auth.User, Auth.UserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: helpersAuth.DEFAULT_USER_NAME,
  },
  email: {
    type: String,
    validate: {
      validator: (value: string) => utils.regExp.email.test(value),
      message: 'Email не валиден',
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
    select: false,
  },
  tokens: {
    type: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    default: [],
    select: false,
  },
});

userSchema.statics = {
  findUserByCredentials: helpersAuth.findUserByCredentials,
};

export default model<Auth.User, Auth.UserModel>('user', userSchema);
