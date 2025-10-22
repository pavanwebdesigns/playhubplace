import { useState, useRef, useEffect } from 'react'; // Import hooks (removed useCallback)
import { useNavigate } from 'react-router-dom';
// Import the new hook and Game type
import { useGetGamesQuery, useLazySearchGamesQuery, type Game } from '../services/gameApi';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// --- SVG Icons ---
const ArrowLeftIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /> </svg> );
const ArrowRightIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /> </svg> );
const LoadingSpinnerIcon = () => ( <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> );


const GameHub = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // --- States for Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const [allGames, setAllGames] = useState<Game[]>([]); // Master list of all loaded games
  const [nextUrl, setNextUrl] = useState<string | null>(null); // To know if there's a next page

  // --- States for Search ---
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  // This ref is for debouncing. `number` is the correct type for browser `setTimeout`
  const debounceTimer = useRef<number | null>(null);

  // --- API Hooks ---
  // 1. Hook for browsing/pagination
  const { data: gamesData, error, isLoading, isFetching } = useGetGamesQuery({
    page: currentPage,
    pagination: 96
  });

  // 2. Hook for searching (we trigger this one manually)
  const [triggerSearch, searchResult] = useLazySearchGamesQuery();
  const { data: searchData, isFetching: isSearching, error: searchError } = searchResult;

  // --- Carousel state ---
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // --- Effect for Appending Games (Fixes "Load More") ---
  useEffect(() => {
    // When new `gamesData` arrives from pagination
    if (gamesData?.items) {
      setAllGames((prevGames) => {
        // Add new games, checking for duplicates just in case
        const existingIds = new Set(prevGames.map(g => g.id));
        const newGames = gamesData.items.filter(g => !existingIds.has(g.id));
        return [...prevGames, ...newGames];
      });
      // Update the nextUrl
      setNextUrl(gamesData.next_url);
    }
  }, [gamesData]); // This runs every time `gamesData` (for the current page) changes

  const handleGameClick = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  // --- Updated Search Handler (Fixes Search) ---
  const handleSearch = (query: string) => {
    setActiveSearchQuery(query); // Set this so we know we're in "search mode"
    setSelectedCategory(null); // Clear category filter when searching

    // Clear any pending search
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (query.trim() === '') {
      // If query is empty, just exit search mode.
      return;
    }

    // Set a timer to search 300ms after the user stops typing
    debounceTimer.current = window.setTimeout(() => {
      triggerSearch(query); // This calls the API
    }, 300);
  };

  // --- Updated Load More Handler (Fixes "Load More") ---
  const handleLoadMore = () => {
    // Only load more if we're not already fetching and a next page exists
    if (!isFetching && nextUrl) {
      setCurrentPage(prev => prev + 1);
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
  }, []); // Runs once
  useEffect(() => {
    // Re-check arrows when allGames list changes
    if (!isLoading && allGames.length > 0) {
      // Use a timeout to ensure DOM is updated
      const timer = setTimeout(() => checkArrows(), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, allGames]); // Runs when data loads
  const scrollCarousel = (direction: 'left' | 'right') => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const scrollAmount = direction === 'left' ? -carousel.clientWidth / 2 : carousel.clientWidth / 2;
    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };
  // --- End Carousel Logic ---

  // --- Render Logic ---

  // Show a full-page loader only on the very first load
  if (isLoading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-white text-xl jersey-font">Loading games...</div>
      </div>
    );
  }

  // Show an error if either API call fails
  if (error || searchError) {
    console.error("API Error:", error || searchError);
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-red-500 text-xl jersey-font">Error loading games. Please try again.</div>
      </div>
    );
  }

  const inSearchMode = activeSearchQuery.trim() !== '';

  // Decide which list to show:
  let displayGames: Game[] = [];
  if (inSearchMode) {
    displayGames = searchData?.items || [];
  } else if (selectedCategory) {
    displayGames = allGames.filter(game => game.category === selectedCategory);
  } else {
    displayGames = allGames;
  }

  // Get categories from the master list (`allGames`) for the filter buttons
  const allCategories = Array.from(new Set(allGames.map(g => g.category)));
  const categoryOrder = ['action', 'adventure', 'puzzle', 'simulation', 'strategy', 'sports', 'racing', 'arcade', 'casual', 'educational'];
  const sortedCategories = allCategories.sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a);
    const bIndex = categoryOrder.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });

  // Re-usable Game Card component
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

        {/* --- Category Carousel (Only show if NOT in search mode) --- */}
        {!inSearchMode && (
          <section className="mb-8 relative">
            {showLeftArrow && (
              <button onClick={() => scrollCarousel('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white p-2 rounded-full hover:bg-black/70 transition-all" aria-label="Scroll left">
                <ArrowLeftIcon />
              </button>
            )}
            <div ref={carouselRef} className="category-carousel hide-scrollbar flex flex-nowrap gap-3 mb-2 pb-4 overflow-x-auto">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 roboto-font whitespace-nowrap ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                All Categories
              </button>
              {sortedCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 roboto-font capitalize whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  {category}
                  <span className="ml-2 text-xs opacity-75">
                    ({allGames.filter(g => g.category === category).length})
                  </span>
                </button>
              ))}
            </div>
            {showRightArrow && (
              <button onClick={() => scrollCarousel('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white p-2 rounded-full hover:bg-black/70 transition-all" aria-label="Scroll right">
                <ArrowRightIcon />
              </button>
            )}
          </section>
        )}

        {/* --- Game Grid Section --- */}
        <section className="mb-12">

          {/* Section Titles */}
          {inSearchMode && isSearching && (
             <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 jersey-title">
                Searching for "{activeSearchQuery}"
                <span className="text-blue-400">&gt;</span>
              </h2>
             </div>
          )}
          {inSearchMode && !isSearching && (
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 jersey-title">
                Search Results for "{activeSearchQuery}"
                <span className="text-blue-400">&gt;</span>
              </h2>
              <span className="text-gray-400 jersey-font">
                {displayGames.length} {displayGames.length === 1 ? 'game' : 'games'} found
              </span>
            </div>
          )}
           {!inSearchMode && selectedCategory && (
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
          {!inSearchMode && !selectedCategory && (
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

          {/* --- Actual Grid or Loading/Empty State --- */}
          {isSearching ? (
            // 1. Show a spinner while searching
            <div className="flex justify-center items-center py-20">
              <LoadingSpinnerIcon />
              <span className="text-white jersey-font text-xl ml-2">Searching...</span>
            </div>
          ) : displayGames.length > 0 ? (
            // 2. Show the grid of games
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'>
              {displayGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            // 3. Show "No results"
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg jersey-font">
                {inSearchMode
                  ? `No games found matching "${activeSearchQuery}"`
                  : 'No games found.'
                }
              </p>
            </div>
          )}
        </section>


        {/* --- Load More Button (Only show if NOT in search and a next page exists) --- */}
        {!inSearchMode && !selectedCategory && nextUrl && ( // Also hide if a category is selected
          <div className="flex justify-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={isFetching} // Disable button while loading next page
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