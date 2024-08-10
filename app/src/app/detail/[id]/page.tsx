"use client"

import { notFound } from 'next/navigation';
import Moviecard from '../../../components/Moviecard';
import '../../../styles/detail.css';

type Movie = {
  id: number;
  year: number;
  name: string;
  producer: string;
  rating: number;
  imageUrl: string;
  duration: number;
  price: number;
  genre: string[];
  description: string;
};

async function getMovie(id: number): Promise<Movie | null> {
  try {
    const response = await fetch(`http://localhost:3000/api/data/${id}`); 
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export default async function Detail({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  const movie = await getMovie(id);

  if (!movie) {
    return notFound();
  }

  return (
    <div className='detailmovie-box2'>
      <button
        type="button"
        className="button-back"
        onClick={() => window.history.back()}
        >
        Back
        </button>
      <div className='detailmovie-box'>
        <Moviecard key={movie.id} movie={movie} />
        <div className='detail-box'>
          <div className='top-item'>
            <div className='video-box' />
            <div className='more-box'>
              <div className='duration-price'>
                <div className='duration-box'>
                  <h1>{`${movie.duration} ms`}</h1>
                </div>
                <div className='price-box'>
                  <h1>{`${movie.price} $`}</h1>
                </div>
              </div>
              <div className='genre-box'>
                <h1>{movie.genre.join(', ')}</h1> 
              </div>
            </div>
          </div>
          <div className='description-box'>
            <p>{movie.description}</p>
          </div>
          <div className='detail-button-box'>
            <button type='button' className='button-detail'>Add to Bookmark</button>
            <button type='button' className='button-detail'>Buy Movie</button>
          </div>
        </div>
      </div>
      <div className='review-box'>
        <h1>Movie Reviews</h1>
        <div className='comment-box'>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
        </div>
        <div className='comment-box'>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
        </div>
        <div className='comment-box'>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
        </div>
        <button type='button' className='button-detail'>Add Review</button>
      </div>
    </div>
  );
}
