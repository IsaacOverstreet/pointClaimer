import { Schema, model, models } from "mongoose";

export interface IClaimRecord {
  userId: string;
  pointsClaimed: number;
  timestamp: Date;
}

const claimHistorySchema = new Schema<IClaimRecord>(
  {
    userId: { type: String, required: true },
    pointsClaimed: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ClaimRecord =
  models.ClaimRecord || model<IClaimRecord>("ClaimRecord", claimHistorySchema);
