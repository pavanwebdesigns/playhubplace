import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// --- FIX: Remove useGetGamesQuery, add Redux hooks ---
import { useAppSelector } from '../store/hooks'; // Assuming path is ../../store/
import type { Game } from '../services/gameApi'; // Keep the type import
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/ui/ScrollToTop'; // Import ScrollToTop

// --- SVG Icons (Unchanged) ---
const BackIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);
const PipIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 7h-8v6h8V7zm2-4H3C1.9 3 1 3.9 1 5v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/>
  </svg>
);
const FullscreenIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
  </svg>
);
const ExitFullscreenIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
  </svg>
);
const CloseIcon = () => (
   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);
const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
  </svg>
);
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.513c.491 0 .702.657.337.95l-4.28 3.11a.563.563 0 00-.182.658l1.583 4.672a.563.563 0 01-.815.63l-4.484-2.354a.563.563 0 00-.52 0L6.32 19.34a.563.563 0 01-.815-.63l1.583-4.672a.563.563 0 00-.182-.658L2.64 9.86c-.365-.293-.154-.95.337-.95h5.513a.563.563 0 00.475-.31l2.125-5.112z" />
  </svg>
);
const OrientationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75A2.25 2.25 0 0015.75 1.5h-2.25m-3 0V3m3 0V3m-3 18v-1.5m3 1.5v-1.5m-6.75-12h10.5" />
  </svg>
);
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-18 0h18" />
  </svg>
);
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);
const DimensionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25v8.25a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 16.5V8.25m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v2.25m18 0V6A2.25 2.25 0 0018.75 3.75H5.25A2.25 2.25 0 003 6m0 0v2.25m0 0v8.25m0 0H4.5m-1.5 0H3" />
  </svg>
);
const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5-4.5L7.5 12l2.25 2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
  </svg>
);
// --- End SVG Icons ---

// Reusable DetailItem component (Unchanged)
const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
  // ... DetailItem JSX ...
  <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg flex items-center gap-4 border border-blue-400/20">
    <div className="flex-shrink-0 text-blue-400">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400 jersey-font">{label}</p>
      <p className="text-white text-base font-semibold jersey-font capitalize">{value}</p>
    </div>
  </div>
);


const GameDetail = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  // --- FIX: Get games list from Redux store ---
  const { allGames, hasLoadedAll } = useAppSelector((state) => state.gameList);
  // --- END FIX ---

  // Local UI state
  const [showGame, setShowGame] = useState(false);
  const [showPiP, setShowPiP] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const pipRef = useRef<HTMLDivElement>(null); // For PiP dragging, if needed later

  // Event Listeners for resize and fullscreen (Unchanged)
  useEffect(() => {
    // ... (fullscreen and resize listeners) ...
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen =
        document.fullscreenElement != null ||
        (document as any).webkitFullscreenElement != null ||
        (document as any).mozFullScreenElement != null ||
        (document as any).msFullscreenElement != null;
      setIsFullscreen(isCurrentlyFullscreen);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Handlers (Unchanged)
  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page (GameHub)
  };

  const handleGameClick = (id: string) => {
    // Navigate to the new game, reset showGame state
    setShowGame(false);
    navigate(`/game/${id}`);
  };

  const handleFullscreen = async () => {
    // ... (fullscreen logic unchanged) ...
    const element = gameAreaRef.current;
    if (!element) return;

    if (!isFullscreen) {
      try {
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if ((element as any).webkitRequestFullscreen) {
          await (element as any).webkitRequestFullscreen();
        } else if ((element as any).mozRequestFullScreen) {
          await (element as any).mozRequestFullScreen();
        } else if ((element as any).msRequestFullscreen) {
          await (element as any).msRequestFullscreen();
        }
      } catch (err) {
        console.error("Fullscreen request failed", err);
      }
    } else {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      } catch (err) {
        console.error("Exit fullscreen request failed", err);
      }
    }
  };

  // --- RENDER LOGIC ---

  // --- FIX: Find the game in the Redux `allGames` list ---
  const game = allGames.find(g => g.id === gameId);

  // --- FIX: Loading state - wait until Redux has games ---
  // We assume GameHub is handling the initial load loop.
  // This page just needs *some* games to exist before searching.
  if (allGames.length === 0 && !hasLoadedAll) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-white text-xl jersey-font">Loading game data...</div>
      </div>
    );
  }

  // --- FIX: Error state - Show "Not Found" if game isn't in Redux list ---
  if (!game) {
    // If we've loaded all games and still can't find it, it's truly not found
    // If we haven't loaded all, maybe it's still loading
    const message = hasLoadedAll ? "Game not found." : "Game data is still loading or game not found.";
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-red-500 text-xl jersey-font">{message}</div>
        <button
          onClick={handleBackClick}
          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded jersey-font"
        >
          Back to Games
        </button>
      </div>
    );
  }
  // --- END FIX ---


  // --- Recommended games logic (uses Redux `allGames`) ---
  const recommendedGames = allGames
    .filter(g => g.id !== gameId && g.category === game.category) // Recommend from same category
    .sort(() => 0.5 - Math.random()) // Shuffle
    .slice(0, isMobile ? 4 : 6);


  // Helper function to format dates (Unchanged)
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  return (
    <div className="min-h-screen bg-primary-dark">
      {/* Header reads global search state from Redux */}
      <Header />

      <div className="container-fluid mx-auto px-4 md:px-8 py-4">
        <button
          onClick={handleBackClick}
          className="text-white hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 jersey-font"
        >
          <BackIcon />
          Back to games
        </button>
      </div>

      <div className="container-fluid mx-auto px-4 md:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white text-center mb-8 jersey-font">
            {game.title}
          </h1>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-400/20 rounded-2xl p-4 md:p-8 relative overflow-hidden game-container">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl opacity-50"></div>

            <div ref={gameAreaRef} className="relative z-10 bg-black rounded-lg">
              {!showGame ? (
                <>
                  <div className="text-center mb-6 relative">
                    {/* ... (Image/Placeholder JSX unchanged) ... */}
                     {game.banner_image ? (
                      <img
                        src={game.banner_image}
                        alt={game.title}
                        className="w-full max-w-md mx-auto rounded-lg shadow-2xl"
                      />
                    ) : (
                      <div className="w-full max-w-md mx-auto h-64 bg-gray-700/50 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-lg jersey-font">No Image</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                       {/* ... (PiP/Fullscreen buttons JSX unchanged) ... */}
                       {!isMobile && (
                        <button
                          onClick={() => setShowPiP(true)}
                          className="text-white bg-black/40 hover:text-blue-400 transition-colors p-2 hover:bg-black/60 rounded-full backdrop-blur-sm"
                          title="Picture-in-Picture"
                        >
                          <PipIcon />
                        </button>
                      )}
                      <button
                        onClick={handleFullscreen}
                        className="text-white bg-black/40 hover:text-blue-400 transition-colors p-2 hover:bg-black/60 rounded-full backdrop-blur-sm"
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                      >
                        {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
                      </button>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                     {/* ... (Play Now button JSX unchanged) ... */}
                     <button
                      onClick={() => setShowGame(true)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 md:px-12 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 jersey-font"
                    >
                      Play Now
                    </button>
                  </div>
                </>
              ) : (
                <>
                   {/* ... (Iframe and controls JSX unchanged) ... */}
                   <div className="w-full aspect-video rounded-lg overflow-hidden iframe-container bg-black">
                    <iframe
                      src={game.url}
                      className="w-full h-full border-0"
                      title={game.title}
                      allowFullScreen
                      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                    />
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <h3 className="text-white text-base md:text-lg jersey-font truncate pr-2">Playing: {game.title}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!isMobile && (
                        <button
                          onClick={() => setShowPiP(true)}
                          className="text-white hover:text-blue-400 transition-colors p-2 hover:bg-gray-700/50 rounded-full"
                          title="Picture-in-Picture"
                        >
                          <PipIcon />
                        </button>
                      )}
                      <button
                        onClick={handleFullscreen}
                        className="text-white hover:text-blue-400 transition-colors p-2 hover:bg-gray-700/50 rounded-full"
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                      >
                        {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
                      </button>
                      <button
                        onClick={() => setShowGame(false)}
                        className="text-white bg-red-600 hover:bg-red-700 transition-colors jersey-font px-4 py-2 rounded-full text-sm"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- Game Details & Description Section (Unchanged) --- */}
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {game.description && (
          <section className="my-12">
            {/* ... Description JSX ... */}
             <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 jersey-title">
              About this Game
              <span className="text-blue-400">&gt;</span>
            </h2>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-400/20 rounded-lg p-6">
              <p className="text-gray-300 text-base jersey-font leading-relaxed">
                {game.description}
              </p>
            </div>
          </section>
        )}
        <section className="my-12">
           {/* ... Details Grid JSX ... */}
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 jersey-title">
            Game Details
            <span className="text-blue-400">&gt;</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <DetailItem icon={<TagIcon />} label="Category" value={game.category} />
            <DetailItem icon={<StarIcon />} label="Quality Score" value={`${Math.round(game.quality_score * 100)}%`} />
            <DetailItem icon={<OrientationIcon />} label="Orientation" value={game.orientation} />
            <DetailItem icon={<CalendarIcon />} label="Published" value={formatDate(game.date_published)} />
            <DetailItem icon={<EditIcon />} label="Last Modified" value={formatDate(game.date_modified)} />
            <DetailItem icon={<DimensionsIcon />} label="Dimensions" value={`${game.width} x ${game.height}`} />
            <DetailItem icon={<CodeIcon />} label="Namespace" value={game.namespace} />
          </div>
        </section>
      </div>

      {/* You May Like Section (Unchanged, uses Redux `allGames` via `recommendedGames`) */}
      <div className="container-fluid mx-auto px-4 md:px-8 py-8">
         {/* ... Recommended Games JSX ... */}
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 jersey-title">
          You may like
          <span className="text-blue-400">&gt;</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {recommendedGames.map((recommendedGame) => (
            <div
              key={recommendedGame.id}
              className="bg-gray-800/50 backdrop-blur-sm border border-blue-400/20 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700/50 hover:border-blue-400/40 transition-all duration-300 transform hover:scale-105"
              onClick={() => handleGameClick(recommendedGame.id)}
            >
              {recommendedGame.banner_image ? (
                <img
                  src={recommendedGame.banner_image}
                  alt={recommendedGame.title}
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div className="w-full h-32 bg-gray-700/50 flex items-center justify-center">
                  <span className="text-gray-400 text-sm jersey-font">No Image</span>
                </div>
              )}
              <div className="p-3">
                <h3 className="text-white font-semibold text-sm truncate jersey-font" title={recommendedGame.title}>
                  {recommendedGame.title}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-blue-400 text-xs capitalize jersey-font">
                    {recommendedGame.category}
                  </span>
                  <span className="text-gray-400 text-xs jersey-font">
                    {Math.round(recommendedGame.quality_score * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

        <Footer />
        <ScrollToTop /> {/* Add ScrollToTop */}

        {/* Floating PiP Window (Unchanged) */}
        {!isMobile && showPiP && (
          <div
            ref={pipRef}
            className="fixed bottom-4 right-4 w-80 h-60 bg-black border-2 border-blue-400 rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col"
          >
             {/* ... PiP JSX ... */}
             <div className="flex-shrink-0 flex justify-between items-center bg-gray-800 p-2 border-b border-gray-600 cursor-move">
              <span className="text-white text-sm jersey-font truncate pr-2">
                PiP: {game.title}
              </span>
              <button
                onClick={() => setShowPiP(false)}
                className="text-white hover:text-red-400 transition-colors"
                title="Close PiP"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="w-full flex-1 relative">
              <iframe
                src={game.url}
                className="absolute inset-0 w-full h-full border-0"
                title={`PiP: ${game.title}`}
                allowFullScreen
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  export default GameDetail;