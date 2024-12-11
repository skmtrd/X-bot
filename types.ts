type DateString = string;
type DeadlineString = string;

export type Assignment = {
  id: string;
  title: string;
  description: string;
  deadLine: DeadlineString;
  imageUrl: string | null;
  authorId: string;
  createdAt: DateString;
  updatedAt: DateString;
  replies: Reply[];
  likes: Like[];
  author: User;
};

type Like = {
  id: string;
  userId: string;
  postId: string | null;
  assignmentId: string;
  questionId: string | null;
  createdAt: DateString;
  updatedAt: DateString;
  user: User;
};

type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: string | null;
  image: string;
  introduction: string | null;
  iconUrl: string | null;
  createdAt: DateString;
  updatedAt: DateString;
  tags?: Tag[];
};

type Tag = {
  id: string;
  name: string;
  createdAt: DateString;
  updatedAt: DateString;
};

type Reply = {
  id: string;
  content: string;
  authorId: string;
  assignmentId: string;
  createdAt: DateString;
  updatedAt: DateString;
};

export type ApiResponse = {
  message: string;
  data: Assignment[];
};

export type DateComponents = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};
