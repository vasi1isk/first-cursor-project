import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import SitterCard from '../components/SitterCard';
import { Sitter } from '../services/api';

interface SearchParams {
  location: string;
  startDate: string;
  endDate: string;
  petType: 'DOG' | 'CAT';
}

const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    location: '',
    startDate: '',
    endDate: '',
    petType: 'DOG'
  });
  const [sittersList, setSittersList] = useState<Sitter[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadSitters = async (params: SearchParams) => {
    setIsLoading(true);
    try {
      // Здесь будет вызов API для получения списка ситтеров
      // const response = await api.getSitters(params);
      // setSittersList(response.data);
    } catch (error) {
      console.error('Error loading sitters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    loadSitters(params);
  };

  const handleFavoriteToggle = (sitterId: number) => {
    setSittersList(prev =>
      prev.map(sitter =>
        sitter.id === sitterId
          ? { ...sitter, isFavorite: !sitter.isFavorite }
          : sitter
      )
    );
  };

  useEffect(() => {
    loadSitters(searchParams);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section with Search */}
      <div className="relative bg-gradient-to-r from-pink-100 via-rose-50 to-orange-100 text-gray-800 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Найдите надежного ситтера для вашего питомца
            </h1>
            <p className="text-lg text-gray-600">
              Доверьте заботу о вашем питомце опытным ситтерам в вашем городе
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative z-10">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Популярные ситтеры</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-300"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sittersList.map(sitter => (
              <SitterCard
                key={sitter.id}
                {...sitter}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home; 