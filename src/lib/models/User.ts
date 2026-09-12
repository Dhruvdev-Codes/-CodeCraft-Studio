import mongoose, { Schema, models } from "mongoose";
import type { Difficulty, LanguageId, Role } from "@/types";

export interface UserDoc {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash?: string;
  image?: string;
  role: Role;
  provider: "credentials" | "google" | "github";
  providerAccountId?: string;
  bio?: string;
  /** courses completed: [{ courseId }] */
  completedCourses: { courseId: mongoose.Types.ObjectId }[];
  /** lessons completed: [{ courseId, lessonId }] */
  completedLessons: { courseId: mongoose.Types.ObjectId; lessonId: mongoose.Types.ObjectId; completedAt: Date }[];
  /** problems solved: [{ problemId, points }] */
  solvedProblems: { problemId: mongoose.Types.ObjectId; points: number; solvedAt: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false },
    image: String,
    role: { type: String, enum: ["student", "developer"], default: "student" },
    provider: { type: String, enum: ["credentials", "google", "github"], default: "credentials" },
    providerAccountId: String,
    bio: String,
    completedCourses: [
      { courseId: { type: Schema.Types.ObjectId, ref: "Course" }, _id: false },
    ],
    completedLessons: [
      {
        courseId: { type: Schema.Types.ObjectId, ref: "Course" },
        lessonId: { type: Schema.Types.ObjectId },
        completedAt: { type: Date, default: Date.now },
        _id: false,
      },
    ],
    solvedProblems: [
      {
        problemId: { type: Schema.Types.ObjectId, ref: "Problem" },
        points: Number,
        solvedAt: { type: Date, default: Date.now },
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

export const User = (models.User as mongoose.Model<UserDoc>) || mongoose.model<UserDoc>("User", UserSchema);