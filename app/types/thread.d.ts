
 type ThreadCategory = "THREAD" | "QNA"

 type Thread = {
  _id: string;
  title: string;
  category: ThreadCategory;
  creationDate: string;
  description: string;
  comments: Comment[]; 
  username: string; 
  isLocked: boolean;
}