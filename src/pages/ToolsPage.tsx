import React, { useState, useMemo } from 'react'; // <--- Remove 'useState'
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/ui/ScrollToTop';
import { toolsData, toolCategories } from '../data/toolsData';
import type { Tool } from '../data/toolsData';
// --- IMPORTS ---
import { useAppSelector } from '../store/hooks';

// --- REMOVE SearchIcon, it's not needed ---

// --- Re-usable Tool Card Component (Unchanged) ... ---
const ToolCard: React.FC<{ tool: Tool }> = ({ tool }) => (
  <Link 
    to={tool.path}
    className="tool-card-container block p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden
               hover:bg-gray-700/50 transition-all duration-300 transform hover:-translate-y-1"
  >
    <div className="flex flex-col items-center text-center">
      {tool.icon}
      <h3 className="text-white font-semibold text-lg truncate jersey-font mb-2" title={tool.name}>
        {tool.name}
      </h3>
      <p className="text-gray-400 text-sm roboto-font line-clamp-2">
        {tool.description}
      </p>
    </div>
  </Link>
);


const ToolsPage: React.FC = () => {
  // --- FIX: Get search query from Redux ---
  const searchQuery = useAppSelector((state) => state.search.query);

  // --- This useMemo hook will now magically update 
  // --- when the global header search changes!
  const filteredTools = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return toolsData;
    
    return toolsData.filter(tool => 
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query)
    );
  }, [searchQuery]); // <-- Now depends on the global query

  // --- (groupedTools logic is unchanged) ---
  const groupedTools = useMemo(() => {
    return filteredTools.reduce((acc, tool) => {
      const category = tool.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(tool);
      return acc;
    }, {} as Record<string, Tool[]>);
  }, [filteredTools]);

  return (
    <div className="min-h-screen bg-primary-dark">
      <Header /> {/* Header now has the global search */}

      <main className="container-fluid mx-auto px-8 py-8">
        
        {/* --- Page Title --- */}
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white jersey-title mb-6">
            All Tools
          </h1>
          <p className="text-lg text-gray-300 roboto-font max-w-2xl mx-auto mb-8">
            A collection of simple, powerful, and free online tools for health, productivity, development, and more.
          </p>
          
          {/* --- LOCAL SEARCH BAR REMOVED --- */}

        </section>

        {/* --- Tools Grid --- */}
        <section>
          {filteredTools.length > 0 ? (
            <div className="space-y-12">
              {toolCategories.map(category => {
                const toolsInCategory = groupedTools[category];
                if (toolsInCategory && toolsInCategory.length > 0) {
                  return (
                    <div key={category}>
                      <h2 className="text-3xl font-bold text-white flex items-center gap-2 jersey-title mb-6">
                        {category}
                        <span className="text-blue-400">&gt;</span>
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {toolsInCategory.map(tool => (
                          <ToolCard key={tool.name} tool={tool} />
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ) : (
            // --- No Search Results ---
            <div className="text-center py-12">
              <p className="text-gray-400 text-2xl jersey-font">
                No tools found matching "{searchQuery}"
              </p>
            </div>
          )}
        </section>

      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default ToolsPage;