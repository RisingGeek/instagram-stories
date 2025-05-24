import { UserStory } from "../../types"
import styles from "./story-list.module.css";

interface StoryListProps {
  userStories: UserStory[];
}

const StoryList = (props: StoryListProps) => {
  const { userStories } = props;

  return (
    <div className='flex p-3 gap-3 overflow-x-auto'>
      {
        userStories.map((story, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={styles.profile_pic_wrapper}>
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
