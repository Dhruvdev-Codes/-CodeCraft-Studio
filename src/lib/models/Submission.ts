import mongoose, { Schema, models } from "mongoose";
import type { LanguageId, SubmissionStatus } from "@/types";

export interface SubmissionDoc {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  problemId?: mongoose.Types.ObjectId;
  contestId?: mongoose.Types.ObjectId;
  code: string;
  language: LanguageId;
  status: SubmissionStatus;
  executionTimeMs: number;
  memoryKb?: number;
  publicPassed: number;
  publicTotal: number;
  hiddenPassed: number;
  hiddenTotal: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<SubmissionDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    problemId: { type: Schema.Types.ObjectId, ref: "Problem", index: true },
    contestId: { type: Schema.Types.ObjectId, ref: "Contest", index: true },
    code: { type: String, required: true },
    language: { type: String, enum: ["python", "javascript", "java", "cpp", "c", "go"], required: true },
    status: {
      type: String,
      enum: [
        "Accepted",
        "Wrong Answer",
        "Time Limit Exceeded",
        "Runtime Error",
        "Compilation Error",
        "Pending",
      ],
      required: true,
    },
    executionTimeMs: { type: Number, default: 0 },
    memoryKb: Number,
    publicPassed: { type: Number, default: 0 },
    publicTotal: { type: Number, default: 0 },
    hiddenPassed: { type: Number, default: 0 },
    hiddenTotal: { type: Number, default: 0 },
  },
  { timestamps: true }
);

SubmissionSchema.index({ userId: 1, problemId: 1, createdAt: -1 });
SubmissionSchema.index({ contestId: 1, status: 1 });

export const Submission =
  (models.Submission as mongoose.Model<SubmissionDoc>) ||
  mongoose.model<SubmissionDoc>("Submission", SubmissionSchema);