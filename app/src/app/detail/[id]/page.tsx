"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {Review} from '../../../models/review';
import Moviecard from '../../../components/Moviecard';
import '../../../styles/detail.css';

type Movie = {
  id: string;
  release_year: number;
  title: string;
  director: string;
  rating?: number;
  cover_image_url: string;
  duration: number;
  price: number;
  genre: string[];
  description: string;
  video_url?: string;
};

export default function Detail({ params }: { params: { id: string } }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState('');
  const router = useRouter();
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  useEffect(() => {
    async function fetchMovie() {
      try {

        const response = await fetch(`/api/films/${params.id}`);
        if (response.ok) {
          const result = await response.json();
          setMovie(result.data || null);
 
          const reviewsResponse = await fetch(`/api/films/${params.id}/reviews` );
          if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json();
            setReviews(reviewsData.data || []);

            const totalRating = reviewsData.data.reduce((acc: number, review: Review) => acc + review.rating, 0);
            const avgRating = reviewsData.data.length ? totalRating / reviewsData.data.length : null;
            setAverageRating(avgRating);
          }

          const bookmarkResponse = await fetch(`/api/films/${params.id}/bookmark`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          });
          if (bookmarkResponse.ok) {
            const bookmarkData = await bookmarkResponse.json();
            if (bookmarkData.data.id) {
              setIsBookmarked(true);
            } else {
              setIsBookmarked(false);
            }
          } else {
            console.error('Failed to fetch bookmark data:', bookmarkResponse.statusText);
            setIsBookmarked(false); 
          }
          
          const purchaseResponse = await fetch(`/api/films/${params.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          });
          if (purchaseResponse.ok) {
            const purchaseData = await purchaseResponse.json();
            if (purchaseData.id) {
              setHasPurchased(true);
            } else {
              setHasPurchased(false);
            }
          } else {
            setHasPurchased(false);
          }

        } else {
          console.error('Failed to fetch movie:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching movie or bookmark data:', error);
      }
    }
  
    fetchMovie();
  }, [params.id, router]);

  
  const toggleBookmark = async (id: string) => {
    try {
      const url = `/api/films/${id}/bookmark`;
      const method = isBookmarked ? 'DELETE' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Failed to ${isBookmarked ? 'remove' : 'add'} bookmark`);
      }

      setIsBookmarked(!isBookmarked);
      alert(`Movie ${isBookmarked ? 'removed from' : 'added to'} bookmarks successfully!`);
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const purchaseMovie = async (id: string) => {
    try {
      const response = await fetch(`/api/films/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to purchase the movie');
      }

      alert('Movie purchased successfully!');
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleSubmitReview = async () => {
    try {
      const response = await fetch(`/api/films/${params.id}/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating: selectedRating, comment }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      setShowPopup(false);
      alert('Review submitted successfully!');
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  if (!movie) {
    return null; 
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
            <div className='video-box'>
            {hasPurchased ? (
                movie.video_url && (
                  <video controls width="100%" height="auto">
                    <source src={movie.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )
              ) : (
                <p>Please purchase the movie to watch the video.</p>
              )}
            </div>
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
                <h1>{movie.genre ? movie.genre.join(', ') : 'Unknown Genre'}</h1>
              </div>
            </div>
          </div>
          <div className='description-box'>
            <p>{movie.description}</p>
          </div>
          <div className='detail-button-box'>
            <button
              type='button'
              className='button-detail'
              onClick={() => toggleBookmark(movie.id)}
            >
              {isBookmarked ? 'Remove Bookmark' : 'Add to Bookmark'}
            </button>
            <button
              type='button'
              className='button-detail'
              onClick={() => purchaseMovie(movie.id)}
            >
              Buy Movie
            </button>
          </div>
        </div>
      </div>
      <div className='review-box'>
        <h1>Movie Reviews</h1>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className='comment-box'>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to review!</p>
        )}
        <button
          type='button'
          className='button-detail'
          onClick={() => setShowPopup(true)} 
        >
          Add Review
        </button>
      </div>


      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h1>Give A Review!</h1>
            <div className="rating-box">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${selectedRating >= star ? 'selected' : ''}`}
                  onClick={() => handleRatingClick(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
              className="comment-input"
            />
            <div className='submit-cancel'>
            <button
              type="button"
              className="button-detail"
              onClick={handleSubmitReview}
            >
              Submit Review
            </button>
            <button
              type="button"
              className="button-detail"
              onClick={() => setShowPopup(false)} 
            >
              Cancel
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
