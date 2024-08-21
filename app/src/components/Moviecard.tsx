import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import IconStar from "../assets/Star.svg";
import '../styles/moviecard.css';
import { useState, useEffect } from 'react';
import {Review} from '../models/review';

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
};

type MovieCardProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  const [rating, setRating] = useState<number | string | null>('New!');

  
  useEffect(() => {
    async function fetchMovie() {
      try {

          const reviewsResponse = await fetch(`/api/films/${movie.id}/reviews`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          });
          if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json();
       
            const totalRating = reviewsData.data.reduce((acc: number, review: Review) => acc + review.rating, 0);
            const avgRating = reviewsData.data.length ? totalRating / reviewsData.data.length : null;
            setRating(avgRating);
          }

        
      } catch (error) {
        console.error('Error fetching movie ', error);
      }
    }
  
    fetchMovie();
  }, []);


  return (
    <Link href={`/detail/${movie.id}`}>
      <div className="card">
        <div className="image">
          <Image 
            src={movie.cover_image_url}  
            alt={movie.title} 
            layout="fill" 
            objectFit="cover" 
          />
        </div>
        <div className="divider"></div>
        <div className="content">
          <div className="description">
            <p>{movie.release_year}</p>
            <p>{movie.director}</p>
            <h1>{movie.title}</h1>
          </div>
          <div className="rating">
            <Image src={IconStar} alt="Star Icon" width={20} height={20} />
            <h1>{rating}</h1>
          </div>
        </div>
      </div>
    </Link>
  );
}
