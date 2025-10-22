import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetGamesQuery } from '../services/gameApi';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const GameHub = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGames, setFilteredGames] = useState<any[]>([]);
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
    
    if (query.trim() === '') {
      setFilteredGames([]);
    } else {
      const filtered = gamesData?.items?.filter(game =>
        game.title.toLowerCase().includes(query.toLowerCase()) ||
        game.category.toLowerCase().includes(query.toLowerCase()) ||
        game.description.toLowerCase().includes(query.toLowerCase())
      ) || [];
      setFilteredGames(filtered);
    }
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-white text-xl jersey-font">Loading games...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-red-500 text-xl jersey-font">Error loading games. Please try again.</div>
        <div className="text-gray-400 text-sm mt-2 jersey-font">Check console for details</div>
      </div>
    );
  }

  const games = gamesData?.items || [];
  const displayGames = searchQuery.trim() ? filteredGames : games;

  // Group games by their actual categories
  const gamesByCategory = displayGames.reduce((acc, game) => {
    const category = game.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(game);
    return acc;
  }, {} as Record<string, any[]>);

  // Get unique categories and sort them
  const categories = Object.keys(gamesByCategory).sort();

  const GameCard = ({ game, className = '' }: { game: any, className?: string }) => (
    <div
      key={game.id}
      className={`game-card bg-gray-800/50 backdrop-blur-sm rounded-lg p- text-center cursor-pointer hover:bg-gray-700/50 transition-all duration-300 ${className}`}
      onClick={() => handleGameClick(game.id)}
    >
      {game.banner_image ? (
        <img
          src={game.banner_image}
          alt={game.title}
          className="w-full h-32 object-cover rounded-t mb-3"
        />
      ) : (
        <div className="w-full h-32 bg-gray-700/50 rounded-t mb-3 flex items-center justify-center">
          <span className="text-gray-400 text-sm">No Image</span>
        </div>
      )}
      <h3 className="text-white font-semibold text-sm ms-2 truncate mb-1 jersey-font text-left" title={game.title}>
        {game.title}
      </h3>
    </div>
  );

  const GameSection = ({ title, games, layout = 'single' }: { title: string, games: any[], layout?: 'single' | 'double' }) => (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 jersey-title">
          {title}
          <span className="text-blue-400">&gt;</span>
        </h2>
      </div>

      <div className={`grid ${layout === 'double' ? 'grid-cols-5' : 'grid-cols-5'} gap-4`}>
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-primary-dark">
      {/* Header */}
      <Header onSearch={handleSearch} />
      
      {/* Main Content */}
      <main className="container mx-auto px-8 py-8">
        {/* Search Results */}
        {searchQuery.trim() && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 jersey-title">
                Search Results for "{searchQuery}"
                <span className="text-blue-400">&gt;</span>
              </h2>
              <span className="text-gray-400 jersey-font">
                {filteredGames.length} games found
              </span>
            </div>

            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg jersey-font">
                  No games found matching "{searchQuery}"
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-blue-400 hover:text-blue-300 jersey-font"
                >
                  Clear search
                </button>
              </div>
            )}
          </section>
        )}

        {/* Games by Category */}
        {!searchQuery.trim() && categories.map((category) => (
          <GameSection 
            key={category} 
            title={category.charAt(0).toUpperCase() + category.slice(1)} 
            games={gamesByCategory[category]} 
          />
        ))}

        {/* Load More Button */}
        {gamesData?.next_url && (
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