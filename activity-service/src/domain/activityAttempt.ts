export type ActivityAttempt = {
  id: string;
  activity_id: string;
  student_id: string;
  answers: Record<string, unknown>;
  submitted_at: string;
};

export type NewActivityAttempt = Omit<ActivityAttempt, "submitted_at">;
