import mongoose, { Schema, models } from "mongoose";
import type { Difficulty, LanguageId, TestCase } from "@/types";

export interface ProblemDoc {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  languages: LanguageId[];
  points: number;
  starterCode: Partial<Record<LanguageId, string>>;
  testCases: TestCase[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TestCaseSchema = new Schema<TestCase>(
  {
    input: { type: String, default: "" },
    expectedOutput: { type: String, required: true },
    hidden: { type: Boolean, default: false },
  },
  { _id: false }
);

const ProblemSchema = new Schema<ProblemDoc>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true },
    languages: {
      type: [String],
      enum: ["python", "javascript", "java", "cpp", "c", "go"],
      default: ["python", "javascript"],
    },
    points: { type: Number, default: 10 },
    starterCode: { type: Schema.Types.Mixed, default: {} },
    testCases: { type: [TestCaseSchema], default: [] },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Problem =
  (models.Problem as mongoose.Model<ProblemDoc>) || mongoose.model<ProblemDoc>("Problem", ProblemSchema);