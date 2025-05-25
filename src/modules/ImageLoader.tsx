import React from 'react'

const ImageLoader = () => {
  return (
    <div
      className='absolute inset-0 flex items-center justify-center bg-black/50 z-[1002]'
      data-testid='story-viewer-loader'
    >
      <div className="w-8 h-8 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
    </div>
  )
}

export default ImageLoader
