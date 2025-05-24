import { UserStory } from "../../types"
import styles from "./story-list.module.css";

interface StoryListProps {
  userStories: UserStory[];
  handleStoryClick: (idx: number) => void;
}

const StoryList = (props: StoryListProps) => {
  const { userStories, handleStoryClick } = props;

  return (
    <div className='flex p-3 gap-3 overflow-x-auto'>
      {
        userStories.map((story, index) => (
          <div key={story.username} className="flex flex-col items-center">
            <div className={styles.profile_pic_wrapper} onClick={() => handleStoryClick(index)}>
              <img
                src={story.profilePic}
                alt={`${story.username}'s profile`}
                className="w-[46px] h-[46px] rounded-full border-2 border-white"
              />
            </div>
            <p className="text-sm">{story.username}</p>
          </div>
        ))
      }
    </div>
  )
}

export default StoryList
