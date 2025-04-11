import React from 'react'

const TopBlurred = () => {
  return (
    <div className="absolute bottom-auto left-0 right-0 top-0 -z-10">
      <img
        src="/top_blurred.png"
        alt={process.env.NEXT_PUBLIC_WEBSITE_NAME}
        className="relative bottom-auto mx-auto top-0 -z-10"
        style={{width: '100%'}}
      />
    </div>
  )
}

export default TopBlurred
