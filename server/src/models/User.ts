import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '@oruvia/shared';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  avatarUrl?: string;
  affiliation?: string;
  bio?: string;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['PUBLIC', 'CONTRIBUTOR', 'EDITOR', 'REVIEWER', 'ADMIN'], 
      default: 'CONTRIBUTOR',
      index: true 
    },
    avatarUrl: { type: String },
    affiliation: { type: String },
    bio: { type: String },
  },
  { timestamps: true }
);

// Partial unique index for phone: allows multiple undefined/missing phones, enforces uniqueness for non-empty string phones
UserSchema.index(
  { phone: 1 },
  {
    unique: true,
    partialFilterExpression: {
      phone: { $type: 'string' }
    }
  }
);

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash);
};

export const User = mongoose.model<IUserDocument>('User', UserSchema);
