
type ThreadCategory = "THREAD" | "QNA" 

type Thread = {
  _id: string
  title: string
  description: string
  username: string
  creationDate: string
  category: string
  isLocked: boolean
  isCensored?: boolean | undefined
  comments?: CommentType[]
}