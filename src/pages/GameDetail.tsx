import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetGamesQuery } from '../services/gameApi';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import type { Game } from '../services/gameApi'; // Import the Game type

// --- SVG Icons ---
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);
// --- NEW Loading Spinner Icon ---
const LoadingSpinnerIcon = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);


const GameHub = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // --- UPDATED State for Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const [allGames, setAllGames] = useState<Game[]>([]); // Master list of all games
  const [nextUrl, setNextUrl] = useState<string | null>(null); // To know if there's a next page

  // Carousel state
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Fetch games from the API
  const { 
    data: gamesData, 
    error, 
    isLoading, // True only on the *first* load
    isFetching // True on first load AND subsequent fetches (e.g., pagination)
  } = useGetGamesQuery({
    page: currentPage,
    pagination: 96
  });

  // --- NEW Effect to append games ---
  useEffect(() => {
    // When new `gamesData` arrives, append it to the `allGames` state
    if (gamesData?.items) {
      setAllGames((prevGames) => {
        // Create a set of existing IDs for fast duplicate checking
        const existingIds = new Set(prevGames.map(g => g.id));
        // Filter out any games we already have
        const newGames = gamesData.items.filter(g => !existingIds.has(g.id));
        return [...prevGames, ...newGames];
      });
      // Store the URL for the next page
      setNextUrl(gamesData.next_url);
    }
  }, [gamesData]); // This runs every time `gamesData` changes

  const handleGameClick = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null);

    if (query.trim() === '') {
      setFilteredGames([]);
    } else {
      // Filter from our master list `allGames`
      const filtered = allGames.filter(game =>
        game.title.toLowerCase().includes(query.toLowerCase()) ||
        game.category.toLowerCase().includes(query.toLowerCase()) ||
        (game.description && game.description.toLowerCase().includes(query.toLowerCase()))
      ) || [];
      setFilteredGames(filtered);
    }
  };

  // --- UPDATED Load More Handler ---
  const handleLoadMore = () => {
    // Only proceed if we are not already fetching and a next page exists
    if (!isFetching && nextUrl) {
      setCurrentPage(prev => prev + 1); // This will trigger the `useGetGamesQuery` to refetch
    }
  };

  // --- Carousel Logic ---
  const checkArrows = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const { scrollLeft, scrollWidth, clientWidth } = carousel;
    setShowLeftArrow(scrollLeft > 1);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
  };
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    carousel.addEventListener('scroll', checkArrows);
    window.addEventListener('resize', checkArrows);
    return () => {
      carousel.removeEventListener('scroll', checkArrows);
      window.removeEventListener('resize', checkArrows);
    };
  }, []);
  useEffect(() => {
    // Check AFTER loading and when allGames has been updated
    if (!isLoading && allGames.length > 0) {
      const timer = setTimeout(() => checkArrows(), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, allGames]); // Depend on allGames now
  const scrollCarousel = (direction: 'left' | 'right') => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const scrollAmount = direction === 'left' ? -carousel.clientWidth / 2 : carousel.clientWidth / 2;
    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };
  // --- End Carousel Logic ---


  // Show full-page loader ONLY on the very first load
  if (isLoading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-white text-xl jersey-font">Loading games...</div>
      </div>
    );
  }

  if (error) {
    console.error("Error loading games:", error);
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-red-500 text-xl jersey-font">Error loading games. Please try again.</div>
        <div className="text-gray-400 text-sm mt-2 jersey-font">Check console for details</div>
      </div>
    );
  }

  // --- UPDATED Render Logic ---
  // `allGames` is now our master list
  let displayGames = searchQuery.trim() ? filteredGames : allGames;

  // Apply category filter if selected and not searching
  if (selectedCategory && !searchQuery.trim()) {
    displayGames = allGames.filter(game => game.category === selectedCategory);
  }

  // Get unique categories from our master list `allGames`
  const uniqueCategories = Array.from(new Set(allGames.map(game => game.category)));

  // Sort categories
  const categoryOrder = ['action', 'adventure', 'puzzle', 'simulation', 'strategy', 'sports', 'racing', 'arcade', 'casual', 'educational'];
  const sortedCategories = uniqueCategories.sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a);
    const bIndex = categoryOrder.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });

  // Game Card component (Unchanged)
  const GameCard = ({ game, className = '' }: { game: Game, className?: string }) => (
    <div
      key={game.id}
      className={`game-card bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden text-center cursor-pointer hover:bg-gray-700/50 transition-all duration-300 ${className}`}
      onClick={() => handleGameClick(game.id)}
    >
      {game.banner_image ? (
        <img
          src={game.banner_image}
          alt={game.title}
          className="w-full h-32 object-cover"
        />
      ) : (
        <div className="w-full h-32 bg-gray-700/50 flex items-center justify-center">
          <span className="text-gray-400 text-sm">No Image</span>
        </div>
      )}
      <div className="p-3 text-left">
        <h3 className="text-white font-semibold text-sm truncate jersey-font mb-1" title={game.title}>
          {game.title}
        </h3>
        <p className="text-blue-400 text-xs capitalize jersey-font truncate">
          {game.category}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-primary-dark">
      <Header onSearch={handleSearch} />

      <main className="container-fluid mx-auto px-8 py-8">
        
        {/* Category Carousel */}
        <section className="mb-8 relative">
          {showLeftArrow && (
            <button 
              onClick={() => scrollCarousel('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white p-2 rounded-full hover:bg-black/70 transition-all"
              aria-label="Scroll left"
            >
              <ArrowLeftIcon />
            </button>
          )}
          <div 
            ref={carouselRef}
            className="category-carousel hide-scrollbar flex flex-nowrap gap-3 mb-2 pb-4 overflow-x-auto"
          >
            <button
              onClick={() => { setSelectedCategory(null); setSearchQuery(''); setFilteredGames([]); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 roboto-font whitespace-nowrap ${
                selectedCategory === null && !searchQuery.trim()
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              All Categories
            </button>
            {sortedCategories.map((category) => (
              <button
                key={category}
                onClick={() => { setSelectedCategory(category); setSearchQuery(''); setFilteredGames([]); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 roboto-font capitalize whitespace-nowrap ${
                  selectedCategory === category && !searchQuery.trim()
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                {category}
                <span className="ml-2 text-xs opacity-75">
                  ({allGames.filter(g => g.category === category).length}) {/* Count from allGames */}
                </span>
              </button>
            ))}
          </div>
          {showRightArrow && (
            <button 
              onClick={() => scrollCarousel('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white p-2 rounded-full hover:bg-black/70 transition-all"
              aria-label="Scroll right"
            >
              <ArrowRightIcon />
            </button>
          )}
        </section>

        {/* Display All Games or Search Results */}
        <section className="mb-12">
          {searchQuery.trim() && (
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 jersey-title">
                Search Results for "{searchQuery}"
                <span className="text-blue-400">&gt;</span>
              </h2>
              <span className="text-gray-400 jersey-font">
                {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'} found
              </span>
            </div>
          )}
           {!searchQuery.trim() && selectedCategory && (
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 jersey-title capitalize">
                {selectedCategory} Games
                <span className="text-blue-400">&gt;</span>
              </h2>
               <span className="text-gray-400 jersey-font text-sm bg-gray-800/50 px-3 py-1 rounded-full">
                {displayGames.length} {displayGames.length === 1 ? 'game' : 'games'}
              </span>
            </div>
          )}
          {!searchQuery.trim() && !selectedCategory && (
             <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 jersey-title">
                All Games
                <span className="text-blue-400">&gt;</span>
              </h2>
              <span className="text-gray-400 jersey-font text-sm bg-gray-800/50 px-3 py-1 rounded-full">
                {displayGames.length} {displayGames.length === 1 ? 'game' : 'games'}
              </span>
            </div>
          )}

          {displayGames.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {displayGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg jersey-font">
                {searchQuery.trim() ? `No games found matching "${searchQuery}"` : (isLoading ? 'Loading...' : 'No games in this category.')}
              </p>
              {searchQuery.trim() && (
                <button
                  onClick={() => handleSearch('')}
                  className="mt-4 text-blue-400 hover:text-blue-300 jersey-font"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </section>

        {/* --- UPDATED Load More Button --- */}
        {nextUrl && !searchQuery.trim() && !selectedCategory && ( // Show if nextUrl exists
          <div className="flex justify-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={isFetching} // Disable button when fetching
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors jersey-font flex items-center justify-center disabled:bg-blue-800 disabled:cursor-not-allowed"
            >
              {isFetching ? (
                <>
                  <LoadingSpinnerIcon />
                  Loading More...
                </>
              ) : (
                'Load More Games'
              )}
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default GameHub;