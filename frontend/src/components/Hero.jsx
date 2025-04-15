import React from 'react'

function Hero() {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
      <img
        src="https://image.tmdb.org/t/p/original/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"
        alt="Hero Background"
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 p-16 z-20 max-w-2xl">
        <h1 className="text-5xl font-bold mb-4">Inception</h1>
        <p className="text-lg mb-4">
          A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.
        </p>
        <div className="flex space-x-4">
          <button className="bg-white text-black px-8 py-2 rounded flex items-center space-x-2 hover:bg-opacity-80">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Play</span>
          </button>
          <button className="bg-gray-600 bg-opacity-70 text-white px-8 py-2 rounded flex items-center space-x-2 hover:bg-opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>More Info</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Hero 