import { NextResponse } from 'next/server';

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

const data: Movie[] = [
  { id:1,year: 2019, name:'Avengers: EndGame',producer: 'Anthony Russo', rating: 4.9,
    imageUrl: '../assets/avengers.jpg',
    duration: 200, 
    price: 100,     
    genre: ['Action', 'Comedy'],  
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur suscipit libero id augue feugiat, et efficitur magna cursus...',},
  {id:2,year: 2018, name:'Avengers: Infinity War',producer: 'Anthony Russo', rating: 2.9,imageUrl: '../assets/avengers.jpg',
    duration: 200, 
    price: 100,     
    genre: ['Action', 'Comedy'],  
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur suscipit libero id augue feugiat, et efficitur magna cursus...',},
  { id:3,year: 2017, name:'Civil War',producer: 'Anthony Russo', rating: 3.9,imageUrl: '../assets/avengers.jpg',
    duration: 200, 
    price: 100,     
    genre: ['Action', 'Comedy'],  
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur suscipit libero id augue feugiat, et efficitur magna cursus...',},
    {id:2,year: 2018, name:'Avengers: Infinity War',producer: 'Anthony Russo', rating: 2.9,imageUrl: '../assets/avengers.jpg',
      duration: 200, 
      price: 100,     
      genre: ['Action', 'Comedy'],  
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur suscipit libero id augue feugiat, et efficitur magna cursus...',},
    { id:3,year: 2017, name:'Civil War',producer: 'Anthony Russo', rating: 3.9,imageUrl: '../assets/avengers.jpg',
      duration: 200, 
      price: 100,     
      genre: ['Action', 'Comedy'],  
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur suscipit libero id augue feugiat, et efficitur magna cursus...',},
];

export async function GET() {
  return NextResponse.json(data);
}
