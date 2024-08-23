// types.ts
export type ThreadCategory = "THREAD" | "QNA";

export type User = {
  userName: string;
  password: string;
};

export type Thread = {
  id: number;
  title: string;
  category: ThreadCategory;
  creationDate: string;
  description: string;
  creator: User;
};

export type QNAThread = Thread & {
  category: "QNA";
  isAnswered: boolean;
  commentAnswerId?: number;
};
