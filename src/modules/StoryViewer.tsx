import React, { useCallback, useEffect, useRef } from 'react'
import { UserStory } from '../types';

interface StoryViewerProps {
  activeUser: UserStory;
  prevUser: UserStory | null;
  onNextUser: () => void;
  onPrevUser: () => void;
  onClose: () => void;
}
const HOLD_THRESHOLD = 500; // 500ms to trigger hold action
const SWIPE_THRESHOLD = 100; // Minimum distance to trigger swipe

const StoryViewer = (props: StoryViewerProps) => {
  const { activeUser, prevUser, onNextUser, onPrevUser, onClose } = props;
  const [currStoryIdx, setCurrentStoryIdx] = React.useState<number>(0);
  const [timerProgress, setTimerProgress] = React.useState<number>(0); // 0-100%
  const [imageLoading, setImageLoading] = React.useState<boolean>(true);
  const [isPaused, setIsPaused] = React.useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = React.useState<boolean>(false);
  const [slideDirection, setSlideDirection] = React.useState<'left' | 'right' | null>(null);
  const holdTriggeredRef = useRef<boolean>(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const swipeTriggeredRef = useRef<boolean>(false);

  const handleStoryAction = useCallback((direction: 'next' | 'prev') => {
    if (holdTriggeredRef.current || swipeTriggeredRef.current) {
      holdTriggeredRef.current = false;
      swipeTriggeredRef.current = false;
      return;
    }
    if (direction === 'next') {
      if (currStoryIdx < activeUser.data.length - 1) {
        setCurrentStoryIdx(currStoryIdx + 1);
      } else {
        // Move to next user
        setSlideDirection('left');
        setIsTransitioning(true);
        setTimeout(() => {
          onNextUser();
          // Reset to first story of the next user
          setCurrentStoryIdx(0);
          setIsTransitioning(false);
          setSlideDirection(null);
        }, 300);
      }
    } else {
      if (currStoryIdx > 0) {
        setCurrentStoryIdx(currStoryIdx - 1);
      } else {
        // Move to previous user
        setSlideDirection('right');
        setIsTransitioning(true);
        setTimeout(() => {
          onPrevUser();
          if (prevUser) {
            setCurrentStoryIdx(prevUser.data.length - 1);
          }
          setIsTransitioning(false);
          setSlideDirection(null);
        }, 300);
      }
    }
    if (!isTransitioning) {
      setImageLoading(true);
      setTimerProgress(0); // Reset progress for next story
    }
  }, [activeUser.data.length, currStoryIdx, onNextUser, onPrevUser, prevUser, isTransitioning]);

  const handleSwipeUser = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      // Swipe left - go to next user
      setSlideDirection('left');
      setIsTransitioning(true);
      setTimeout(() => {
        onNextUser();
        setCurrentStoryIdx(0);
        setIsTransitioning(false);
        setSlideDirection(null);
      }, 300);
    } else {
      // Swipe right - go to previous user
      setSlideDirection('right');
      setIsTransitioning(true);
      setTimeout(() => {
        onPrevUser();
        if (prevUser) {
          setCurrentStoryIdx(prevUser.data.length - 1);
        }
        setIsTransitioning(false);
        setSlideDirection(null);
      }, 300);
    }
    setImageLoading(true);
    setTimerProgress(0);
  }

  const formatTimeStamp = (timestamp: string): string => {
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

  const handlePauseTimer = () => {
    setIsPaused(true);
    holdTriggeredRef.current = false;
    setTimeout(() => {
      holdTriggeredRef.current = true;
    }, HOLD_THRESHOLD);
  };

  const handleResumeTimer = () => {
    setIsPaused(false);
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    swipeTriggeredRef.current = false;
    handlePauseTimer();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) {
      handleResumeTimer();
      return;
    }

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };

    const diffX = touchEnd.x - touchStartRef.current.x;
    const diffY = touchEnd.y - touchStartRef.current.y;

    // Check if it's a horizontal swipe (more horizontal than vertical movement)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > SWIPE_THRESHOLD) {
      swipeTriggeredRef.current = true;
      if (diffX > 0) {
        // Swipe right - go to previous user
        handleSwipeUser('right');
      } else {
        // Swipe left - go to next user
        handleSwipeUser('left');
      }
    }

    touchStartRef.current = null;
    handleResumeTimer();
  };

  useEffect(() => {
    if (isPaused) {
      return;
    }
    const startTime = Date.now();
    const storyDuration = 5000; // 5 seconds per story
    const interval = setInterval(() => {
      const diffTime = (timerProgress / 100) * storyDuration + Date.now() - startTime;
      if (diffTime >= storyDuration) {
        // Load next story
        handleStoryAction('next');
      } else {
        // Update timer progress
        setTimerProgress((diffTime / storyDuration) * 100);
      }
    }, 50);
    if (imageLoading) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [handleStoryAction, imageLoading, isPaused, timerProgress]);

  const getTransformClass = () => {
    if (!isTransitioning || !slideDirection) return '';
    return slideDirection === 'left' ? '-translate-x-full' : 'translate-x-full';
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black z-[1000] flex flex-col items-center justify-center" data-testid="story-viewer">
      <div
        className={`relative w-full h-full max-w-[600px] transition-transform duration-300 ease-in-out ${getTransformClass()}`}
        onMouseDown={handlePauseTimer}
        onMouseUp={handleResumeTimer}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className='absolute top-[5px] left-[15px] right-[15px] flex gap-1 h-[3px]'>
          {activeUser.data.map((images, index) => (
            <div key={images.image} className='grow bg-white/30'>
              <div
                style={{ width: index === currStoryIdx ? `${timerProgress}%` : index < currStoryIdx ? "100%" : '0' }}
                className='h-full bg-white'
                data-testid={`story-viewer-progress-${index}`}
              />
            </div>
          ))}
        </div>
        <div className='absolute top-[15px] left-[15px] flex items-center gap-2 z-[1000]'>
          <img
            src={activeUser.profilePic}
            alt={activeUser.username}
            className='w-[40px] h-[40px] rounded-full'
          />
          <span className='text-white font-bold' data-testid="story-viewer-username">{activeUser.username}</span>
          <span className='text-white'>{formatTimeStamp(activeUser.data[currStoryIdx].timestamp)}</span>
        </div>
        <button
          type="button"
          className='absolute top-[15px] right-[15px] text-white text-3xl z-[1002]'
          onClick={onClose}
          data-testid='close-story-viewer'
        >&times;</button>
        {imageLoading && (
          <div
            className='absolute inset-0 flex items-center justify-center bg-black/50 z-[1002]'
            data-testid='story-viewer-loader'
          >
            <div className="w-8 h-8 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={activeUser.data[currStoryIdx].image}
          alt={`${activeUser.username}-${currStoryIdx}`}
          className={`w-full h-full object-cover ${imageLoading ? 'hidden' : 'block'}`}
          data-testid='story-viewer-image'
          onLoad={() => setImageLoading(false)}
        />
        <button
          type='button'
          className='absolute top-0 bottom-0 w-1/2'
          onClick={() => handleStoryAction('prev')}
          data-testid='story-viewer-nav-prev'
        />
        <button
          type='button'
          className='absolute top-0 bottom-0 right-0 w-1/2'
          onClick={() => handleStoryAction('next')}
          data-testid='story-viewer-nav-next'
        />

      </div>
    </div>

  )
}

export default StoryViewer
