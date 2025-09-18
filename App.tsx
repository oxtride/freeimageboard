import React from 'react';
import Header from './components/Header';
import Board from './components/Board';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto px-2 md:px-4 py-4">
        <Board />
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Powered by React, Tailwind, and the Gemini API.</p>
        <p>This is a frontend-only demonstration. All data is stored in your browser's localStorage and is not shared with other users.</p>
      </footer>
    </div>
  );
};

export default App;
