import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetGamesQuery, type Game } from '../services/gameApi';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/ui/ScrollToTop';
// --- Make sure these imports are correct ---
import { useAppSelector, useAppDispatch } from '../store/hooks'; // Path confirmed by user
import { appendGames, goToNextPage, setHasLoadedAll } from '../store/gameListSlice'; // Assuming path is ../../store/

// --- SVG Icons (Unchanged) ---
const ArrowLeftIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /> </svg> );
const ArrowRightIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /> </svg> );
const LoadingSpinnerIcon = () => ( <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> );


const GameHub = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // --- Get state from the Redux store ---
  const { allGames, fetchPage, hasLoadedAll } = useAppSelector((state) => state.gameList);
  const activeSearchQuery = useAppSelector((state) => state.search.query);

  // --- Local state (UI only) ---
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(96);
  const PAGE_SIZE = 96;
  const [nextUrl, setNextUrl] = useState<string | null>(null);

  // --- API Hooks ---
  const { data: gamesData, error, isLoading, isFetching } = useGetGamesQuery({
    page: fetchPage,
    pagination: 96
  });

  // --- Carousel state ---
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // --- Effect 1: Appending Games ---
  useEffect(() => {
    if (gamesData?.items) {
      dispatch(appendGames(gamesData.items));
      setNextUrl(gamesData.next_url); // Keep track of the *latest* nextUrl
    }
  }, [gamesData, dispatch]);

  // --- Effect 2: Automatic Page Fetcher ---
  useEffect(() => {
    // Check conditions based on the *latest* API response and Redux state
    if (!isFetching && nextUrl && !error && !hasLoadedAll) {
      dispatch(goToNextPage());
    }
    // Mark as loaded ONLY if the *last* fetch had no nextUrl
    if (!nextUrl && !isFetching && !hasLoadedAll && allGames.length > 0) {
       // Small safety check: ensure we didn't get rate limited on the very first try
      if (fetchPage > 1 || gamesData?.items?.length === 96) {
         dispatch(setHasLoadedAll(true));
      }
    }
  }, [nextUrl, isFetching, error, hasLoadedAll, allGames.length, fetchPage, gamesData, dispatch]);


  const handleGameClick = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  // --- Local Search: Reset category/pagination ---
   useEffect(() => {
    // If search query changes, reset category and pagination
    if (activeSearchQuery.trim() !== '') {
        setSelectedCategory(null);
        setDisplayCount(PAGE_SIZE);
    }
  }, [activeSearchQuery]);

  // --- Local "Load More" Handler ---
  const handleLoadMore = () => {
    setDisplayCount(prevCount => prevCount + PAGE_SIZE);
  };

  // --- Carousel Logic (Unchanged) ---
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
    // Use a timeout to ensure DOM is updated after games are loaded
    if (!isLoading && allGames.length > 0) {
      const timer = setTimeout(() => checkArrows(), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, allGames]); // Rely on Redux allGames
  const scrollCarousel = (direction: 'left' | 'right') => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const scrollAmount = direction === 'left' ? -carousel.clientWidth / 2 : carousel.clientWidth / 2;
    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };
  // --- End Carousel Logic ---

  // --- RENDER LOGIC ---

  // 1. Show full-page loader ONLY if Redux is empty AND the first fetch is happening
  if (isLoading && allGames.length === 0) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-white text-xl jersey-font">Loading games...</div>
      </div>
    );
  }

  // 2. Show fatal error ONLY if Redux is empty AND the first fetch failed
  if (error && allGames.length === 0) {
    console.error("API Error (Fatal):", error);
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-red-500 text-xl jersey-font">Error loading games. Please try again.</div>
      </div>
    );
  }

  const inSearchMode = activeSearchQuery.trim() !== '';

  // --- Display Logic (using Redux `allGames`) ---
  let displayGames: Game[] = [];
  let fullFilteredList: Game[] = [];

  if (inSearchMode) {
    fullFilteredList = allGames.filter(game =>
      game.title.toLowerCase().includes(activeSearchQuery.toLowerCase())
    );
    displayGames = fullFilteredList;
  } else if (selectedCategory) {
    fullFilteredList = allGames.filter(game => game.category === selectedCategory);
    displayGames = fullFilteredList.slice(0, displayCount);
  } else {
    // Default: Show paginated list from Redux
    fullFilteredList = allGames;
    displayGames = fullFilteredList.slice(0, displayCount);
  }

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
      {/* Header reads search query from Redux */}
      <Header />

      <main className="container-fluid mx-auto px-8 py-8">

        {/* --- Category Carousel --- */}
        {!inSearchMode && allGames.length > 0 && ( // Hide if no games yet
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
          {/* --- FIX: Replaced placeholder --- */}
          {inSearchMode && (
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 jersey-title">
                Search Results for "{activeSearchQuery}"
                <span className="text-blue-400">&gt;</span>
              </h2>
              <span className="text-gray-400 jersey-font">
                {/* Use displayGames length here as it holds the search results */ }
                {displayGames.length} {displayGames.length === 1 ? 'game' : 'games'} found
              </span>
            </div>
          )}
          {/* --- END FIX --- */}
          {!inSearchMode && selectedCategory && (
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 jersey-title capitalize">
                {selectedCategory} Games
                <span className="text-blue-400">&gt;</span>
              </h2>
               <span className="text-gray-400 jersey-font text-sm bg-gray-800/50 px-3 py-1 rounded-full">
                {fullFilteredList.length} {fullFilteredList.length === 1 ? 'game' : 'games'}
              </span>
            </div>
           )}
          {!inSearchMode && !selectedCategory && (
             <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 jersey-title">
                All Games
                <span className="text-blue-400">&gt;</span>
              </h2>
              {/* Show loader only if the background loop isn't finished AND we are actively fetching */ }
              {isFetching && !hasLoadedAll ? (
                <span className="text-gray-400 jersey-font text-sm flex items-center">
                  <LoadingSpinnerIcon />
                  Loading...
                </span>
              ) : (
                <span className="text-gray-400 jersey-font text-sm bg-gray-800/50 px-3 py-1 rounded-full">
                  {fullFilteredList.length} {fullFilteredList.length === 1 ? 'game' : 'games'}
                </span>
              )}
            </div>
          )}

          {/* Grid / Empty State */}
          {/* Check if we are done loading the *first* page before showing "No games" */}
          {!isLoading && displayGames.length === 0 ? (
             <div className="text-center py-12">
              <p className="text-gray-400 text-lg jersey-font">
                {inSearchMode
                  ? `No games found matching "${activeSearchQuery}"`
                   // If not searching and no games displayed yet, maybe still loading?
                  : allGames.length > 0 ? 'No games in this category.' : 'Loading games...'
                }
              </p>
            </div>
          ) : (
             <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'>
              {displayGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </section>

        {/* --- "Load More" button --- */}
        {!inSearchMode && displayCount < fullFilteredList.length && (
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

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default GameHub;