export interface UserImage {
  image: string;
  timestamp: string;
}
export interface UserStory {
  id: string;
  username: string;
  profilePic: string;
  timestamp: string;
  data: UserImage[];
}