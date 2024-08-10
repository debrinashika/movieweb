import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import IconStar from "../assets/Star.svg";
import Avengers from "../assets/avengers.jpg";
import '../styles/moviecard.css';

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

type MovieCardProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/detail/${movie.id}`}>
    <div className="card">
      <div className="image">
        <Image src={Avengers} alt={movie.name} layout="fill" objectFit="cover" />
      </div>
      <div className="divider"></div>
      <div className="content">
        <div className="description">
          <p>{movie.year}</p>
          <p>{movie.producer}</p>
          <h1>{movie.name}</h1>
        </div>
        <div className="rating">
          <Image src={IconStar} alt="Star Icon" width={20} height={20} />
          <h1>{movie.rating.toFixed(1)}</h1>
        </div>
      </div>
    </div>
    </Link>
  );
}
