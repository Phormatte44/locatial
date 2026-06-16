export type ProjectType = "story" | "guide" | "collection";

export type PlaceAssignmentState = "unassigned" | "candidate" | "assigned";

export type StopStatus =
  | "empty"
  | "outlined"
  | "researching"
  | "drafting"
  | "review"
  | "done";

export interface StopCamera {
  zoom?: number;
  pitch?: number;
  bearing?: number;
}
