export type ActivityType = "quiz" | "caso_estudio" | "simulacion" | "colaborativa";

export type Activity = {
  id: string;
  ova_id: string;
  type: ActivityType;
  title: string;
  description: string | null;
  config: Record<string, unknown>;
  created_at: string;
};

export type NewActivity = Omit<Activity, "created_at" | "description"> & {
  description?: string | null;
};
