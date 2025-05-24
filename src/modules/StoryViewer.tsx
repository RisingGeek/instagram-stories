import React from 'react'
import { UserStory } from '../types';

interface StoryViewerProps {
  activeUser: UserStory;
  onNextUser: () => void;
  onPrevUser: () => void;
}
const StoryViewer = (props: StoryViewerProps) => {
  const { activeUser, onNextUser, onPrevUser } = props;
  const [currStoryIdx, setCurrentStoryIdx] = React.useState<number>(0);

  const handleStoryAction = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      if (currStoryIdx < activeUser.data.length - 1) {
        setCurrentStoryIdx(currStoryIdx + 1);
      } else {
        // Move to next user
        onNextUser();
      }
    } else {
      if (currStoryIdx > 0) {
        setCurrentStoryIdx(currStoryIdx - 1);
      } else {
        // Move to previous user
        onPrevUser();
      }
    }
  }
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black z-[1000] flex flex-col items-center justify-center">
      <div className='relative w-full h-full max-w-[600px]'>
        <img src={activeUser.data[currStoryIdx]} alt={`${activeUser.username}-${currStoryIdx}`} />
        <button
          type='button'
          className='absolute top-0 bottom-0 w-1/2'
          onClick={() => handleStoryAction('next')}
        />
        <button
          type='button'
          className='absolute top-0 bottom-0 right-0 w-1/2'
          onClick={() => handleStoryAction('prev')}
        />

      </div>
    </div>

  )
}

export default StoryViewer
