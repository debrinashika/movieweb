"use client";

import { useEffect, useState } from 'react';
import Moviecard from '../components/Moviecard';
import Navigate from '../assets/navigate.svg';
import Navigate2 from '../assets/navigate-right.svg';
import SearchLogo from '../assets/search.svg';
import Image from 'next/image';
import '../styles/page.css';

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

const ITEMS_PER_PAGE = 3;

export default function Home() {
  const [data, setData] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  const handleNext = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(filteredData.length / ITEMS_PER_PAGE) - 1));
  };

  const handlePrev = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
  };

  const startIdx = currentPage * ITEMS_PER_PAGE;
  const filteredData = data.filter(movie => 
    movie.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    movie.producer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const currentItems = filteredData.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const maxVisiblePages = 5;

  const startPage = Math.max(0, Math.min(currentPage - Math.floor(maxVisiblePages / 2), totalPages - maxVisiblePages));
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages - 1);

  const createPaginationButtons = () => {
    const buttons = [];
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className='page-item'
          onClick={() => setCurrentPage(i)}
          disabled={i === currentPage}
        >
          {i + 1}
        </button>
      );
    }
    return buttons;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className='home-content'>
      <div className='title-movie'>
        <h1>MOVIE LIST</h1>
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by title or director"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <Image src={SearchLogo} alt="Search" className="search-logo" />
          </div>
        </div>
      </div>
      <div className='movie-list-box'>
        <button 
          className='prev-button' 
          onClick={handlePrev} 
          disabled={currentPage === 0}
        >
          <Image src={Navigate} alt='previous' />
        </button>
        <div className='movie-list'>
          {currentItems.map((movie) => (
            <Moviecard key={movie.id} movie={movie} />
          ))}
          {Array(ITEMS_PER_PAGE - currentItems.length).fill(null).map((_, index) => (
            <div key={index} className='placeholder'>Not Available</div>
          ))}
        </div>
        <button 
          className='next-button' 
          onClick={handleNext} 
          disabled={currentPage === Math.ceil(filteredData.length / ITEMS_PER_PAGE) - 1}
        >
          <Image src={Navigate2} alt='next' />
        </button>
      </div>
      <div className='pagination'>
        <button
          className='page-item'
          onClick={handlePrev}
          disabled={currentPage === 0}
        >
          {'<'}
        </button>
        {createPaginationButtons()}
        <button
          className='page-item'
          onClick={handleNext}
          disabled={currentPage === Math.ceil(filteredData.length / ITEMS_PER_PAGE) - 1}
        >
          {'>'}
        </button>
      </div>
    </div>
  );
}
