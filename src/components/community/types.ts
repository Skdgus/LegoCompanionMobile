export type FriendFace = "sang" | "jordan" | "riley" | "kaitlyn" | "jonathan" | "andrew" | "alex" | "gregory" | "alastair";

export type Friend = {
  id: string;
  name: string;
  level: string;
  companion: string;
  face: FriendFace;
};

export type EventItem = {
  id: string;
  title: string;
  cityLine: string;
  dateLine: string;
  timeLine: string;
  detailLine: string;
  img: string;
};

