interface StoryProgressProps {
  progressBarCount: number;
  currStoryIdx: number;
  timerProgress: number;
}
const StoryProgress = (props: StoryProgressProps) => {
  const { progressBarCount, currStoryIdx, timerProgress } = props;
  return (
    <div className='absolute top-[5px] left-[15px] right-[15px] flex gap-1 h-[3px]'>
      {Array.from({ length: progressBarCount }, (_, idx) => idx).map((index) => (
        <div key={index} className='grow bg-white/30'>
          <div
            style={{ width: index === currStoryIdx ? `${timerProgress}%` : index < currStoryIdx ? "100%" : '0' }}
            className='h-full bg-white'
            data-testid={`story-viewer-progress-${index}`}
          />
        </div>
      ))}
    </div>
  )
}

export default StoryProgress
