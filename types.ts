export type ThreadCategory = "THREAD" | "QNA"

export type Thread = {
  id: number
  title: string
  category: ThreadCategory
  creationDate: string
  description: string
}
