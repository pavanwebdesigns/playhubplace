import React from 'react';

interface GameCardProps {
  title?: string;
  image?: string;
  variant?: 'placeholder' | 'featured' | 'thumbnail';
  onClick?: () => void;
  className?: string;
  showPlayButton?: boolean;
  showActions?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({
  title,
  image,
  variant = 'placeholder',
  onClick,
  className = '',
  showPlayButton = false,
  showActions = false,
}) => {
  const baseClasses = 'game-card relative aspect-video';
  
  const variantClasses = {
    placeholder: '',
    featured: 'p-6',
    thumbnail: '',
  };

  const sizeClasses = {
    placeholder: 'w-full h-32',
    featured: 'w-full h-80',
    thumbnail: 'w-full h-32',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {variant === 'featured' && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-32 h-32 object-cover rounded-lg mb-4"
            />
          ) : (
            <div className="w-32 h-32 bg-primary-light rounded-lg mb-4 flex items-center justify-center">
              <span className="text-secondary-gray text-4xl">🎮</span>
            </div>
          )}
          
          {title && (
            <h3 className="text-xl font-bold text-secondary-white mb-4">
              {title}
            </h3>
          )}
          
          {showPlayButton && (
            <button className="play-button">
              Play Now
            </button>
          )}
        </div>
      )}

      {variant === 'thumbnail' && (
        <div className="flex flex-col items-center justify-center h-full">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-primary-light rounded-lg flex items-center justify-center">
              <span className="text-secondary-gray text-2xl">🎮</span>
            </div>
          )}
          
          {title && (
            <div className="absolute bottom-2 left-2 right-2">
              <p className="text-sm font-medium text-secondary-white bg-black bg-opacity-50 
                          rounded px-2 py-1 text-center">
                {title}
              </p>
            </div>
          )}
        </div>
      )}

      {variant === 'placeholder' && (
        <div className="flex items-center justify-center h-full">
          <span className="text-secondary-gray text-2xl">🎮</span>
        </div>
      )}

      {showActions && (
        <div className="absolute top-2 right-2 flex gap-2">
          <button className="p-1 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all">
            <svg className="w-4 h-4 text-secondary-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
          <button className="p-1 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all">
            <svg className="w-4 h-4 text-secondary-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default GameCard;
