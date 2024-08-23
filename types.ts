export type Comment = {
  id: number;
  threadId: number;
  content: string;
  creationDate: string;
  username: string; 
}

export type ThreadCategory = "THREAD" | "QNA"

export type Thread = {
  id: number;
  title: string;
  category: ThreadCategory;
  creationDate: string;
  description: string;
  comments: Comment[]; 
  username: string; 
}
