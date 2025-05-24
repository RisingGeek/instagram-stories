import React, { useCallback, useEffect } from 'react'
import { UserStory } from '../types';

interface StoryViewerProps {
  activeUser: UserStory;
  onNextUser: () => void;
  onPrevUser: () => void;
  onClose: () => void;
}
const StoryViewer = (props: StoryViewerProps) => {
  const { activeUser, onNextUser, onPrevUser, onClose } = props;
  const [currStoryIdx, setCurrentStoryIdx] = React.useState<number>(0);
  const [timerProgress, setTimerProgress] = React.useState<number>(0); // 0-100%

  const handleStoryAction = useCallback((direction: 'next' | 'prev') => {
    if (direction === 'next') {
      if (currStoryIdx < activeUser.data.length - 1) {
        setCurrentStoryIdx(currStoryIdx + 1);
      } else {
        // Move to next user
        onNextUser();
        // Reset to first story of the next user
        setCurrentStoryIdx(0);
      }
    } else {
      if (currStoryIdx > 0) {
        setCurrentStoryIdx(currStoryIdx - 1);
      } else {
        const lastImgIdx = activeUser.data.length - 1;
        // Move to previous user
        onPrevUser();
        // Reset to last story of the previous user
        setCurrentStoryIdx(lastImgIdx);
      }
    }
  }, [activeUser.data.length, currStoryIdx, onNextUser, onPrevUser])

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const diffTime = Date.now() - startTime;
      const storyDuration = 5000; // 5 seconds per story
      if (diffTime >= storyDuration) {
        handleStoryAction('next');
      } else {
        setTimerProgress(Math.trunc((diffTime / storyDuration) * 100));
      }
    }, 50);

    return () => clearInterval(interval);
  }, [handleStoryAction]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("5 seconds")
    }, 5000)

    return () => clearInterval(interval);
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black z-[1000] flex flex-col items-center justify-center">
      <div className='relative w-full h-full max-w-[600px]'>
        <div className='absolute top-[5px] left-[15px] right-[15px] flex gap-1 h-[3px]'>
          {activeUser.data.map((_, index) => (
            <div className='grow bg-white/30'>
              <div
                style={{ width: index === currStoryIdx ? `${timerProgress}%` : index < currStoryIdx ? "100%" : '0' }}
                className='h-full bg-white' />
            </div>
          ))}
        </div>
        <div className='absolute top-[15px] left-[15px] flex items-center gap-2'>
          <img
            src={activeUser.profilePic}
            alt={activeUser.username}
            className='w-[40px] h-[40px] rounded-full'
          />
          <span className='text-white font-bold'>{activeUser.username}</span>
        </div>
        <button
          type="button"
          className='absolute top-[15px] right-[15px] text-white text-3xl z-[1002]'
          onClick={onClose}
        >&times;</button>
        <img
          src={activeUser.data[currStoryIdx]}
          alt={`${activeUser.username}-${currStoryIdx}`}
          className='h-full object-cover'
        />
        <button
          type='button'
          className='absolute top-0 bottom-0 w-1/2'
          onClick={() => handleStoryAction('prev')}
        />
        <button
          type='button'
          className='absolute top-0 bottom-0 right-0 w-1/2'
          onClick={() => handleStoryAction('next')}
        />

      </div>
    </div>

  )
}

export default StoryViewer
