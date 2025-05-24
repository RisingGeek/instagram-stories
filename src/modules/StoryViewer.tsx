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
  const [imageLoading, setImageLoading] = React.useState<boolean>(true);

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
    setImageLoading(true);
    setTimerProgress(0); // Reset progress for next story
  }, [activeUser.data.length, currStoryIdx, onNextUser, onPrevUser]);

  function formatTimeStamp(timestamp: string): string {
    const now = Date.now();
    const diffMs = now - new Date(timestamp).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return `${diffSec}s`;
    if (diffMin < 60) return `${diffMin}m`;
    if (diffHr < 24) return `${diffHr}h`;
    return `${diffDay}d`;
  }

  useEffect(() => {
    const startTime = Date.now();
    const storyDuration = 5000; // 5 seconds per story
    const interval = setInterval(() => {
      const diffTime = Date.now() - startTime;
      if (diffTime >= storyDuration) {
        // Load next story
        handleStoryAction('next');
      } else {
        // Update timer progress
        setTimerProgress(Math.trunc((diffTime / storyDuration) * 100));
      }
    }, 50);
    if (imageLoading) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [handleStoryAction, imageLoading]);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black z-[1000] flex flex-col items-center justify-center">
      <div className='relative w-full h-full max-w-[600px]'>
        <div className='absolute top-[5px] left-[15px] right-[15px] flex gap-1 h-[3px]'>
          {activeUser.data.map((images, index) => (
            <div key={images.image} className='grow bg-white/30'>
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
          <span className='text-white'>{formatTimeStamp(activeUser.data[currStoryIdx].timestamp)}</span>
        </div>
        <button
          type="button"
          className='absolute top-[15px] right-[15px] text-white text-3xl z-[1002]'
          onClick={onClose}
        >&times;</button>
        {imageLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
            <div className="w-8 h-8 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={activeUser.data[currStoryIdx].image}
          alt={`${activeUser.username}-${currStoryIdx}`}
          className={`h-full object-cover ${imageLoading ? 'hidden' : 'block'}`}
          onLoad={() => setImageLoading(false)}
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
