import { UserStory } from '../types'

interface StoryHeaderProps {
  activeUser: UserStory;
  currStoryIdx: number;
  onClose: () => void;
}
const StoryHeader = (props: StoryHeaderProps) => {
  const { activeUser, currStoryIdx, onClose } = props;

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

  return (
    <>
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
    </>
  )
}

export default StoryHeader
