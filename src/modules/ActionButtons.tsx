interface ActionButtonsProps {
  handleStoryAction: (direction: 'next' | 'prev') => void;
}
const ActionButtons = (props: ActionButtonsProps) => {
  const {handleStoryAction} = props;
  return (
    <>
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
    </>
  )
}

export default ActionButtons
