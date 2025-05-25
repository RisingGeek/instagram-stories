import { UserStory } from "../../types"
import styles from "./story-list.module.css";

interface StoryListProps {
  userStories: UserStory[];
  handleStoryClick: (idx: number) => void;
}

const StoryList = (props: StoryListProps) => {
  const { userStories, handleStoryClick } = props;

  return (
    <div className='flex p-3 gap-3 overflow-x-auto' data-testid="story-list">
      {
        userStories.map((story, index) => (
          <div key={story.username} className="flex flex-col items-center" data-testid="story-list-item">
            <div className={styles.profile_pic_wrapper} onClick={() => handleStoryClick(index)}>
              <img
                src={story.profilePic}
                alt={`${story.username}'s profile`}
                className="w-[46px] h-[46px] rounded-full border-2 border-white"
                data-testid="story-list-item-thumbnail"
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
