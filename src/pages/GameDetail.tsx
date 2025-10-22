import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetGamesQuery } from '../services/gameApi';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const GameDetail = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [showGame, setShowGame] = useState(false);
  const [showPiP, setShowPiP] = useState(false);
  const pipRef = useRef<HTMLDivElement>(null);

  // Fetch games to find the specific game and get recommendations
  const { data: gamesData, error, isLoading } = useGetGamesQuery({ 
    page: 1, 
    pagination: 96 
  });

  const handleBackClick = () => {
    navigate('/');
  };

  const handleGameClick = (id: string) => {
    navigate(`/game/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-white text-xl jersey-font">Loading game...</div>
      </div>
    );
  }

  if (error || !gamesData) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-red-500 text-xl jersey-font">Error loading game.</div>
        <button
          onClick={handleBackClick}
          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded jersey-font"
        >
          Back to Games
        </button>
      </div>
    );
  }

  // Find the specific game by ID
  const game = gamesData.items.find(g => g.id === gameId);

  if (!game) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-red-500 text-xl jersey-font">Game not found.</div>
        <button
          onClick={handleBackClick}
          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded jersey-font"
        >
          Back to Games
        </button>
      </div>
    );
  }

  // Get recommended games (exclude current game)
  const recommendedGames = gamesData.items.filter(g => g.id !== gameId).slice(0, 10);

  return (
    <div className="min-h-screen bg-primary-dark">
      {/* Header */}
      <Header onSearch={() => {}} />
      
      {/* Back Button */}
      <div className="container mx-auto px-8 py-4">
        <button
          onClick={handleBackClick}
          className="text-white hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 jersey-font"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to games
        </button>
      </div>

      {/* Main Game Container */}
      <div className="container mx-auto px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Game Title */}
          <h1 className="text-3xl font-bold text-white text-center mb-8 jersey-font">
            {game.title}
          </h1>
          
            {/* Game Container */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-400/20 rounded-2xl p-8 relative overflow-hidden game-container">
              {/* Gradient Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl"></div>
            
            <div className="relative z-10">
              {!showGame ? (
                <>
                  {/* Game Thumbnail */}
                  <div className="text-center mb-8">
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
                  </div>
                  
                  {/* Play Now Button */}
                  <div className="text-center mb-6">
                    <button
                      onClick={() => setShowGame(true)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 jersey-font"
                    >
                      Play Now
                    </button>
                  </div>
                  
                  {/* Action Icons */}
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => {
                        console.log('PiP button clicked (preview screen)');
                        setShowPiP(!showPiP);
                      }}
                      className="text-white hover:text-blue-400 transition-colors p-2  hover:bg-gray-500 rounded"
                      title="Picture-in-Picture"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 7h-8v6h8V7zm2-4H3C1.9 3 1 3.9 1 5v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/>
                      </svg>
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          console.log('Fullscreen button clicked (preview screen)');
                          // In preview screen, we'll make the game container fullscreen
                          const gameContainer = document.querySelector('.game-container') as HTMLElement;
                          console.log('Game container found:', gameContainer);
                          
                          if (gameContainer) {
                            console.log('Requesting fullscreen on game container...');
                            if (gameContainer.requestFullscreen) {
                              await gameContainer.requestFullscreen();
                              console.log('Fullscreen requested successfully');
                            } else if ((gameContainer as any).webkitRequestFullscreen) {
                              await (gameContainer as any).webkitRequestFullscreen();
                              console.log('Webkit fullscreen requested successfully');
                            } else if ((gameContainer as any).mozRequestFullScreen) {
                              await (gameContainer as any).mozRequestFullScreen();
                              console.log('Mozilla fullscreen requested successfully');
                            } else if ((gameContainer as any).msRequestFullscreen) {
                              await (gameContainer as any).msRequestFullscreen();
                              console.log('MS fullscreen requested successfully');
                            } else {
                              console.log('Fullscreen not supported');
                              alert('Fullscreen is not supported in this browser');
                            }
                          } else {
                            console.log('Game container not found');
                            alert('Game container not found');
                          }
                        } catch (error) {
                          console.log('Fullscreen failed:', error);
                          alert('Fullscreen failed: ' + error);
                        }
                      }}
                      className="text-white hover:text-blue-400 transition-colors p-2  hover:bg-gray-600 rounded"
                      title="Fullscreen"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                      </svg>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Game Header */}
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white text-lg jersey-font">Playing: {game.title}</h3>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => {
                          console.log('PiP button clicked (playing screen)');
                          setShowPiP(!showPiP);
                        }}
                        className="text-white hover:text-blue-400 transition-colors p-2 hover:bg-gray-500 rounded"
                        title="Picture-in-Picture"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 7h-8v6h8V7zm2-4H3C1.9 3 1 3.9 1 5v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/>
                        </svg>
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            console.log('Fullscreen button clicked (playing screen)');
                            // Try to request fullscreen on the iframe container
                            let iframeContainer = document.querySelector('.iframe-container') as HTMLElement;
                            console.log('Iframe container found:', iframeContainer);
                            
                            // If not found, try to find the iframe directly
                            if (!iframeContainer) {
                              const iframe = document.querySelector('iframe') as HTMLIFrameElement;
                              if (iframe) {
                                iframeContainer = iframe.parentElement as HTMLElement;
                                console.log('Using iframe parent as container:', iframeContainer);
                              }
                            }
                            
                            if (iframeContainer) {
                              console.log('Requesting fullscreen...');
                              if (iframeContainer.requestFullscreen) {
                                await iframeContainer.requestFullscreen();
                                console.log('Fullscreen requested successfully');
                              } else if ((iframeContainer as any).webkitRequestFullscreen) {
                                await (iframeContainer as any).webkitRequestFullscreen();
                                console.log('Webkit fullscreen requested successfully');
                              } else if ((iframeContainer as any).mozRequestFullScreen) {
                                await (iframeContainer as any).mozRequestFullScreen();
                                console.log('Mozilla fullscreen requested successfully');
                              } else if ((iframeContainer as any).msRequestFullscreen) {
                                await (iframeContainer as any).msRequestFullscreen();
                                console.log('MS fullscreen requested successfully');
                              } else {
                                console.log('Fullscreen not supported');
                                alert('Fullscreen is not supported in this browser');
                              }
                            } else {
                              console.log('Iframe container not found');
                              alert('Game container not found');
                            }
                          } catch (error) {
                            console.log('Fullscreen failed:', error);
                            alert('Fullscreen failed: ' + error);
                          }
                        }}
                        className="text-white hover:text-blue-400 transition-colors p-2 hover:bg-gray-600 rounded"
                        title="Fullscreen"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => setShowGame(false)}
                        className="text-white hover:text-red-400 transition-colors jersey-font px-3 py-1 rounded"
                      >
                        Close Game
                      </button>
                    </div>
                  </div>
                  
                  {/* Embedded Game */}
                  <div className="w-full h-96 rounded-lg overflow-hidden iframe-container bg-black">
                    <iframe
                      src={game.url}
                      className="w-full h-full border-0"
                      title={game.title}
                      allowFullScreen
                      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* You May Like Section */}
      <div className="container mx-auto px-8 py-8">
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
      
        {/* Footer */}
        <Footer />

        {/* Floating PiP Window */}
        {showPiP && (
          <div
            ref={pipRef}
            className="fixed bottom-4 right-4 w-80 h-60 bg-black border-2 border-blue-400 rounded-lg shadow-2xl z-50 overflow-hidden"
            style={{ resize: 'both' }}
          >
            <div className="flex justify-between items-center bg-gray-800 p-2 border-b border-gray-600">
              <span className="text-white text-sm jersey-font">Picture-in-Picture: {game.title}</span>
              <button
                onClick={() => setShowPiP(false)}
                className="text-white hover:text-red-400 transition-colors"
                title="Close PiP"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <div className="w-full h-full">
              <iframe
                src={game.url}
                className="w-full h-full border-0"
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
