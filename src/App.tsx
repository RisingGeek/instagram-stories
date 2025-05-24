import { act, use, useEffect, useState } from "react";
import StoryList from "./modules/story-list/StoryList";
import { UserStory } from "./types";
import StoryViewer from "./modules/StoryViewer";

function App() {
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [activeUserStoryIdx, setActiveUserStoryIdx] = useState<number>(-1);

  useEffect(() => {
    const fetchStories = async () => {
      const response = await fetch('/stories.json');
      const data: UserStory[] = await response.json();
      setUserStories(data);
    };
    fetchStories();
  }, []);

  const handleStoryClick = (idx: number) => {
    setActiveUserStoryIdx(idx);
  };

  const handleNextUser = () => {
    if (activeUserStoryIdx === userStories.length - 1) {
      // close the story viewer if the last user is reached
      setActiveUserStoryIdx(-1);
    } else {
      setActiveUserStoryIdx(activeUserStoryIdx + 1);
    }
  };

  const handlePrevUser = () => {
    if (activeUserStoryIdx === 0) {
      // close the story viewer if the first user is reached
      setActiveUserStoryIdx(-1);
    } else {
      setActiveUserStoryIdx(activeUserStoryIdx - 1);
    }
  }

  const handleClose = () => {
    setActiveUserStoryIdx(-1);
  }

  return (
    <div>
      <StoryList
        userStories={userStories}
        handleStoryClick={handleStoryClick}
      />
      {activeUserStoryIdx !== -1 && (
        <StoryViewer
          activeUser={userStories[activeUserStoryIdx]}
          onNextUser={handleNextUser}
          onPrevUser={handlePrevUser}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default App;
