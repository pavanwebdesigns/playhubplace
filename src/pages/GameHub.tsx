import { useState, useRef, useEffect } from 'react'; // Import useRef and useEffect
import { useNavigate } from 'react-router-dom';
import { useGetGamesQuery } from '../services/gameApi';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import type { Game } from '../services/gameApi'; // Import the Game type

// Simple SVG Arrow components
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


const GameHub = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGames, setFilteredGames] = useState<Game[]>([]); // Use Game type
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Carousel state
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Fetch games from the API
  const { data: gamesData, error, isLoading } = useGetGamesQuery({
    page: currentPage,
    pagination: 96
  });

  const handleGameClick = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null); // Clear category filter when searching

    if (query.trim() === '') {
      setFilteredGames([]);
    } else {
      const filtered = gamesData?.items?.filter(game =>
        game.title.toLowerCase().includes(query.toLowerCase()) ||
        game.category.toLowerCase().includes(query.toLowerCase()) ||
        (game.description && game.description.toLowerCase().includes(query.toLowerCase())) // Check if description exists
      ) || [];
      setFilteredGames(filtered);
    }
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  // --- Carousel Logic ---
  const checkArrows = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = carousel;
    // Show left arrow if not at the beginning
    setShowLeftArrow(scrollLeft > 1);
    // Show right arrow if not at the end (with a 1px tolerance)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
  };

  // Check arrows on mount, resize, and when categories change
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // Check on initial load
    checkArrows();

    // Add event listeners
    carousel.addEventListener('scroll', checkArrows);
    window.addEventListener('resize', checkArrows);

    // Cleanup listeners
    return () => {
      carousel.removeEventListener('scroll', checkArrows);
      window.removeEventListener('resize', checkArrows);
    };
  }, [gamesData]); // Re-check when game data (and thus categories) load

  const scrollCarousel = (direction: 'left' | 'right') => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const scrollAmount = direction === 'left' 
      ? -carousel.clientWidth / 2 // Scroll left by half the visible width
      : carousel.clientWidth / 2; // Scroll right by half the visible width

    carousel.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };
  // --- End Carousel Logic ---


  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-white text-xl jersey-font">Loading games...</div>
      </div>
    );
  }

  if (error) {
    // Log the actual error for debugging
    console.error("Error loading games:", error);
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-red-500 text-xl jersey-font">Error loading games. Please try again.</div>
        <div className="text-gray-400 text-sm mt-2 jersey-font">Check console for details</div>
      </div>
    );
  }

  const allFetchedGames = gamesData?.items || [];
  let displayGames = searchQuery.trim() ? filteredGames : allFetchedGames;

  // Apply category filter if selected and not searching
  if (selectedCategory && !searchQuery.trim()) {
    displayGames = allFetchedGames.filter(game => game.category === selectedCategory);
  }

  // Get unique categories from all fetched games for the filter buttons
  const uniqueCategories = Array.from(new Set(allFetchedGames.map(game => game.category)));

  // Sort categories with better ordering
  const categoryOrder = ['action', 'adventure', 'puzzle', 'simulation', 'strategy', 'sports', 'racing', 'arcade', 'casual', 'educational'];
  const sortedCategories = uniqueCategories.sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a);
    const bIndex = categoryOrder.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });

  // Updated Game Card component to include category
  const GameCard = ({ game, className = '' }: { game: Game, className?: string }) => ( // Use Game type
    <div
      key={game.id}
      className={`game-card bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden text-center cursor-pointer hover:bg-gray-700/50 transition-all duration-300 ${className}`}
      onClick={() => handleGameClick(game.id)}
    >
      {game.banner_image ? (
        <img
          src={game.banner_image}
          alt={game.title}
          className="w-full h-32 object-cover" // Removed rounded-t mb-3
        />
      ) : (
        <div className="w-full h-32 bg-gray-700/50 flex items-center justify-center"> {/* Removed rounded-t mb-3 */}
          <span className="text-gray-400 text-sm">No Image</span>
        </div>
      )}
      <div className="p-3 text-left"> {/* Added padding and text-left */}
        <h3 className="text-white font-semibold text-sm truncate jersey-font mb-1" title={game.title}> {/* Removed game-title class, added mb-1 */}
          {game.title}
        </h3>
        <p className="text-blue-400 text-xs capitalize jersey-font truncate"> {/* Added category display */}
          {game.category}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-primary-dark">
      {/* Header */}
      <Header onSearch={handleSearch} />

      {/* Main Content */}
      <main className="container-fluid mx-auto px-8 py-8">
        
        {/* === CATEGORY FILTER (CAROUSEL) === */}
        {/* Added relative positioning to the wrapper */}
        <section className="mb-8 relative">
          
          {/* Left Arrow Button */}
          {showLeftArrow && (
            <button 
              onClick={() => scrollCarousel('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white p-2 rounded-full hover:bg-black/70 transition-all"
              aria-label="Scroll left"
            >
              <ArrowLeftIcon />
            </button>
          )}

          {/* Carousel container */}
          <div 
            ref={carouselRef} // Add the ref
            className="category-carousel hide-scrollbar flex flex-nowrap gap-3 mb-2 pb-4 overflow-x-auto" // Added hide-scrollbar
          >
            <button
              onClick={() => { setSelectedCategory(null); setSearchQuery(''); setFilteredGames([]); }} // Also clear search
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 roboto-font whitespace-nowrap ${ // Added whitespace-nowrap
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
                onClick={() => { setSelectedCategory(category); setSearchQuery(''); setFilteredGames([]); }} // Also clear search
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 roboto-font capitalize whitespace-nowrap ${ // Added whitespace-nowrap
                  selectedCategory === category && !searchQuery.trim()
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                {category}
                <span className="ml-2 text-xs opacity-75">
                  ({allFetchedGames.filter(g => g.category === category).length}) {/* Count from all games */}
                </span>
              </button>
            ))}
          </div>
          
          {/* Right Arrow Button */}
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
        {/* === END CATEGORY FILTER === */}


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
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 jersey-title capitalize"> {/* Added capitalize */}
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
                {searchQuery.trim() ? `No games found matching "${searchQuery}"` : 'No games in this category.'}
              </p>
              {searchQuery.trim() && (
                <button
                  onClick={() => handleSearch('')} // Use handleSearch to clear
                  className="mt-4 text-blue-400 hover:text-blue-300 jersey-font"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </section>

        {/* Load More Button */}
        {gamesData?.next_url && !searchQuery.trim() && !selectedCategory && ( // Only show Load More if not searching or filtering
          <div className="flex justify-center mt-12">
            <button
              onClick={handleLoadMore}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors jersey-font"
            >
              Load More Games
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default GameHub;