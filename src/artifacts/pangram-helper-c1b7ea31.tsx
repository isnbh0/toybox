import React, { useState, useEffect } from 'react';

const PangramHelper = () => {
  const [text, setText] = useState('');
  const [usedLetters, setUsedLetters] = useState({});
  const [remainingCount, setRemainingCount] = useState(26);
  // QWERTY keyboard layout rows
  const topRow = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const middleRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const bottomRow = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  useEffect(() => {
    // Create a set of unique lowercase letters used in the text
    const letters = new Set(text.toLowerCase().split('').filter(char => /[a-z]/.test(char)));
    
    // Convert to an object with letter keys
    const usedLettersObj = {};
    alphabet.forEach(letter => {
      usedLettersObj[letter.toLowerCase()] = letters.has(letter.toLowerCase());
    });
    
    setUsedLetters(usedLettersObj);
    setRemainingCount(26 - letters.size);
  }, [text]);
  
  const handleTextChange = (e) => {
    setText(e.target.value);
  };
  
  return (
    <div className="flex flex-col items-center p-6 max-w-3xl mx-auto bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Pangram Helper</h1>
      
      <div className="w-full mb-6">
        {/* QWERTY Keyboard Layout */}
        <div className="flex flex-col items-center gap-2 mb-4">
          {/* Top row */}
          <div className="flex gap-1">
            {topRow.map(letter => (
              <div 
                key={letter}
                className={`
                  flex items-center justify-center
                  w-10 h-10 rounded-md 
                  font-bold text-lg
                  ${usedLetters[letter.toLowerCase()] 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-500'}
                  transition-all duration-300
                `}
              >
                {letter}
              </div>
            ))}
          </div>
          
          {/* Middle row */}
          <div className="flex gap-1 ml-5">
            {middleRow.map(letter => (
              <div 
                key={letter}
                className={`
                  flex items-center justify-center
                  w-10 h-10 rounded-md 
                  font-bold text-lg
                  ${usedLetters[letter.toLowerCase()] 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-500'}
                  transition-all duration-300
                `}
              >
                {letter}
              </div>
            ))}
          </div>
          
          {/* Bottom row */}
          <div className="flex gap-1 ml-12">
            {bottomRow.map(letter => (
              <div 
                key={letter}
                className={`
                  flex items-center justify-center
                  w-10 h-10 rounded-md 
                  font-bold text-lg
                  ${usedLetters[letter.toLowerCase()] 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-500'}
                  transition-all duration-300
                `}
              >
                {letter}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-md shadow-sm mb-4">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Letters remaining:</span>
            <span className={`font-bold ${remainingCount === 0 ? 'text-green-600' : 'text-blue-600'}`}>
              {remainingCount}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {alphabet.map(letter => (
              !usedLetters[letter.toLowerCase()] && (
                <span 
                  key={`remaining-${letter}`}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                >
                  {letter}
                </span>
              )
            ))}
          </div>
        </div>
      </div>
      
      <div className="w-full">
        <label 
          htmlFor="pangram-input" 
          className="block mb-2 font-medium text-gray-700"
        >
          Type your pangram:
        </label>
        <textarea
          id="pangram-input"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          rows="4"
          value={text}
          onChange={handleTextChange}
          placeholder="Enter text here to track used letters..."
        />
        
        {remainingCount === 0 && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
            🎉 Congratulations! You've used all 26 letters!
          </div>
        )}
      </div>
    </div>
  );
};

export default PangramHelper;

export const metadata = {
  title: "Pangram Helper",
  description: "A tool to help create pangrams by tracking which letters have been used in your text. Features a QWERTY keyboard layout that highlights used letters in green.",
  type: "react",
  tags: ["pangram","writing","letters","keyboard","qwerty"],
  folder: "writing-tools",
  createdAt: "2025-07-07T00:00:00.000Z",
  updatedAt: "2025-07-07T00:00:00.000Z",
} as const;
