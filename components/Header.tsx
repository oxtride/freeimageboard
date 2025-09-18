
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-3xl font-bold text-cyan-400 tracking-wider">/g/ - Gemini Imageboard</h1>
        <p className="text-gray-400">The premier destination for AI-generated discussions.</p>
      </div>
    </header>
  );
};

export default Header;
