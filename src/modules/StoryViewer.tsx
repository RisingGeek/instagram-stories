import React, { useCallback, useEffect, useRef } from 'react'
import { UserStory } from '../types';
import StoryProgress from './StoryProgress';
import StoryHeader from './StoryHeader';
import ImageLoader from './ImageLoader';
import ActionButtons from './ActionButtons';

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
    let isUserChange = false;
    if (direction === 'next') {
      if (currStoryIdx < activeUser.data.length - 1) {
        setCurrentStoryIdx(currStoryIdx + 1);
      } else {
        // Move to next user
        isUserChange = true;
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
        isUserChange = true;
        setSlideDirection('right');
        setIsTransitioning(true);
        setTimeout(() => {
          onPrevUser();
          if (prevUser) {
            setCurrentStoryIdx(0);
          }
          setIsTransitioning(false);
          setSlideDirection(null);
        }, 300);
      }
    }
    if (!isTransitioning) {
      setImageLoading(isUserChange);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleStoryAction, imageLoading, isPaused]);

  useEffect(() => {
    const currImages = activeUser.data;
    // Load next image beforehand for fast story viewing
    const nextImg = new Image();
    if (currStoryIdx < currImages.length - 1) {
      nextImg.src = currImages[currStoryIdx + 1].image;
    }
  }, [activeUser.data, currStoryIdx, prevUser])

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
        <StoryProgress
          progressBarCount={activeUser.data.length}
          currStoryIdx={currStoryIdx}
          timerProgress={timerProgress}
        />
        <StoryHeader
          activeUser={activeUser}
          currStoryIdx={currStoryIdx}
          onClose={onClose}
        />
        {imageLoading && <ImageLoader />}
        <img
          src={activeUser.data[currStoryIdx].image}
          alt={`${activeUser.username}-${currStoryIdx}`}
          className={`w-full h-full object-cover ${imageLoading ? 'hidden' : 'block'}`}
          data-testid='story-viewer-image'
          onLoad={() => setImageLoading(false)}
        />
        <ActionButtons handleStoryAction={handleStoryAction} />

      </div>
    </div>

  )
}

export default StoryViewer
