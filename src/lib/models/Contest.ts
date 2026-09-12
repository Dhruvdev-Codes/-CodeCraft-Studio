import mongoose, { Schema, models } from "mongoose";

export interface ContestEntryDoc {
  problemId: mongoose.Types.ObjectId;
  points: number;
}

export interface ContestDoc {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  startTime: Date;
  endTime: Date;
  problems: ContestEntryDoc[];
  createdAt: Date;
  updatedAt: Date;
}

const ContestEntrySchema = new Schema<ContestEntryDoc>(
  {
    problemId: { type: Schema.Types.ObjectId, ref: "Problem", required: true },
    points: { type: Number, required: true },
  },
  { _id: false }
);

const ContestSchema = new Schema<ContestDoc>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    problems: { type: [ContestEntrySchema], default: [] },
  },
  { timestamps: true }
);

ContestSchema.index({ startTime: 1, endTime: 1 });

export const Contest =
  (models.Contest as mongoose.Model<ContestDoc>) || mongoose.model<ContestDoc>("Contest", ContestSchema);