import { useEffect, useState } from "react";
import StoryList from "./modules/story-list/StoryList";
import { UserStory } from "./types";

function App() {
  const [userStories, setUserStories] = useState<UserStory[]>([]);

  useEffect(() => {
    const fetchStories = async () => {
      const response = await fetch('/stories.json');
      const data: UserStory[] = await response.json();
      setUserStories(data);
    };
    fetchStories();
  }, []);

  return (
    <div>
      <StoryList userStories={userStories} />
    </div>
  );
}

export default App;
