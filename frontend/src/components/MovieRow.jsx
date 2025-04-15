import React from 'react'

function MovieRow({ title, movies }) {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 px-4 md:px-8">{title}</h2>
      <div className="relative">
        <div className="grid grid-cols-4 gap-4 pb-4 px-4 md:px-8">
          {movies.map((movie) => (
            <div key={movie.id} className="group">
              <div className="relative">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-64 object-cover rounded movie-card"
                />
                <div className="movie-overlay flex items-center justify-center">
                  <button className="play-button">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                  </button>
                </div>
              </div>
              <h3 className="mt-2 text-sm font-medium">{movie.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MovieRow 