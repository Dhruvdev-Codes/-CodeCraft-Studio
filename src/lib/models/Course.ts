import mongoose, { Schema, models } from "mongoose";
import type { CourseLesson, Difficulty, LanguageId } from "@/types";

export interface CourseDoc {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  language: LanguageId;
  difficulty: Difficulty;
  icon: string;
  order: number;
  lessons: CourseLesson[];
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<CourseLesson>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    order: { type: Number, required: true },
    duration: { type: String, default: "10 min" },
    content: { type: String, default: "" },
    code: { type: String, default: "" },
    language: { type: String, enum: ["python", "javascript", "java", "cpp", "c", "go"] },
  },
  { _id: false }
);

const CourseSchema = new Schema<CourseDoc>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    language: { type: String, enum: ["python", "javascript", "java", "cpp", "c", "go"], required: true },
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true },
    icon: { type: String, default: "📚" },
    order: { type: Number, default: 0 },
    lessons: { type: [LessonSchema], default: [] },
  },
  { timestamps: true }
);

export const Course = (models.Course as mongoose.Model<CourseDoc>) || mongoose.model<CourseDoc>("Course", CourseSchema);