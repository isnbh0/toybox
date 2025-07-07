import React, { useState, useEffect, useRef } from 'react';

const WaffleHelper = () => {
  const [inputText, setInputText] = useState('');
  const [board, setBoard] = useState([]);
  const [selectedTile, setSelectedTile] = useState(null);
  const [swapCount, setSwapCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [draggedTile, setDraggedTile] = useState(null);
  const [dragOverTile, setDragOverTile] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [lockedTiles, setLockedTiles] = useState({});
  const [unlockCandidate, setUnlockCandidate] = useState(null);
  const unlockTimerRef = useRef(null);

  // Parse input text to initialize the waffle board
  const parseInput = (text) => {
    // Remove any extra spaces and split by '/'
    const sections = text.trim().split('/').map(section => section.trim());
    
    if (sections.length !== 5) {
      alert('Please enter 5 sections separated by slashes');
      return;
    }
    
    // Expected lengths for each row based on waffle shape
    const expectedLengths = [5, 3, 5, 3, 5];
    
    // Validate input lengths
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].length !== expectedLengths[i]) {
        alert(`Section ${i+1} should have ${expectedLengths[i]} characters`);
        return;
      }
    }
    
    // Create the board structure
    const newBoard = [];
    let index = 0;
    
    // Row 1: 5 tiles
    newBoard.push(createRow(sections[0], 0));
    
    // Row 2: 1 tile, 1 empty, 1 tile, 1 empty, 1 tile
    newBoard.push([
      createTile(sections[1][0], 5),
      null,
      createTile(sections[1][1], 6),
      null,
      createTile(sections[1][2], 7)
    ]);
    
    // Row 3: 5 tiles
    newBoard.push(createRow(sections[2], 8));
    
    // Row 4: 1 tile, 1 empty, 1 tile, 1 empty, 1 tile
    newBoard.push([
      createTile(sections[3][0], 13),
      null,
      createTile(sections[3][1], 14),
      null,
      createTile(sections[3][2], 15)
    ]);
    
    // Row 5: 5 tiles
    newBoard.push(createRow(sections[4], 16));
    
    setBoard(newBoard);
    // Save initial state to history
    setHistory([{board: JSON.parse(JSON.stringify(newBoard)), swapCount: 0}]);
    // Clear locks
    setLockedTiles({});
  };
  
  // Helper function to create a row of tiles
  const createRow = (letters, startIndex) => {
    return Array.from(letters).map((letter, i) => createTile(letter, startIndex + i));
  };
  
  // Helper function to create a tile object
  const createTile = (letter, index) => {
    return {
      letter: letter.toUpperCase(),
      index,
      color: determineColor(letter)
    };
  };
  
  // Determine color based on letter case
  const determineColor = (letter) => {
    if (letter === letter.toLowerCase() && letter !== ' ') {
      return '#f5f5f5'; // White for lowercase (black letters in the image)
    } else {
      // For uppercase letters (white letters in the image)
      return letter.match(/[BPDRY]/) ? '#8BBF6A' : '#E9C46A'; // Green or Yellow
    }
  };
  
  // Lock a tile
  const lockTile = (rowIndex, colIndex) => {
    const tileKey = `${rowIndex}-${colIndex}`;
    const newLockedTiles = { ...lockedTiles };
    newLockedTiles[tileKey] = true;
    setLockedTiles(newLockedTiles);
  };
  
  // Unlock a tile
  const unlockTile = (rowIndex, colIndex) => {
    const tileKey = `${rowIndex}-${colIndex}`;
    const newLockedTiles = { ...lockedTiles };
    delete newLockedTiles[tileKey];
    setLockedTiles(newLockedTiles);
    setUnlockCandidate(null);
  };
  
  // Reset locks
  const resetLocks = () => {
    setLockedTiles({});
  };
  
  // Check if a tile is locked
  const isTileLocked = (rowIndex, colIndex) => {
    return !!lockedTiles[`${rowIndex}-${colIndex}`];
  };
  
  // Check if a tile is the unlock candidate
  const isUnlockCandidate = (rowIndex, colIndex) => {
    return unlockCandidate && 
           unlockCandidate.rowIndex === rowIndex && 
           unlockCandidate.colIndex === colIndex;
  };
  
  // Handle unlock click (when "click again to unlock" is shown)
  const handleUnlockClick = (rowIndex, colIndex) => {
    if (isUnlockCandidate(rowIndex, colIndex)) {
      unlockTile(rowIndex, colIndex);
      if (unlockTimerRef.current) {
        clearTimeout(unlockTimerRef.current);
        unlockTimerRef.current = null;
      }
    }
  };
  
  // Handle tile click - multi-function: select, lock, unlock
  const handleTileClick = (tile, rowIndex, colIndex) => {
    if (!tile) return;
    
    const tileKey = `${rowIndex}-${colIndex}`;
    
    // Case 1: Tile is locked - set up for unlock
    if (isTileLocked(rowIndex, colIndex)) {
      // If this is already the unlock candidate, do nothing
      if (unlockCandidate && unlockCandidate.rowIndex === rowIndex && unlockCandidate.colIndex === colIndex) {
        return;
      }
      
      // Clear any existing unlock timer
      if (unlockTimerRef.current) {
        clearTimeout(unlockTimerRef.current);
      }
      
      // Set as unlock candidate
      setUnlockCandidate({ tile, rowIndex, colIndex });
      
      // Set timer to clear unlock candidate after 1 second
      unlockTimerRef.current = setTimeout(() => {
        setUnlockCandidate(null);
      }, 1000);
      
      return;
    }
    
    // Case 2: Tile is the same as the selected tile - lock it
    if (selectedTile && selectedTile.rowIndex === rowIndex && selectedTile.colIndex === colIndex) {
      lockTile(rowIndex, colIndex);
      setSelectedTile(null);
      return;
    }
    
    // Case 3: There is a currently selected tile - perform swap
    if (selectedTile !== null) {
      // Check if destination tile is locked (should not happen due to UI, but as a safeguard)
      if (isTileLocked(rowIndex, colIndex)) {
        return;
      }
      
      // Perform swap
      performSwap(selectedTile.rowIndex, selectedTile.colIndex, rowIndex, colIndex);
      setSelectedTile(null);
      return;
    }
    
    // Case 4: No selected tile - select this one
    setSelectedTile({ tile, rowIndex, colIndex });
  };
  
  // Perform the actual swap operation
  const performSwap = (fromRow, fromCol, toRow, toCol) => {
    if (fromRow === toRow && fromCol === toCol) return;
    
    const newBoard = JSON.parse(JSON.stringify(board));
    
    // Swap letters
    const tempLetter = newBoard[toRow][toCol].letter;
    newBoard[toRow][toCol].letter = newBoard[fromRow][fromCol].letter;
    newBoard[fromRow][fromCol].letter = tempLetter;
    
    setBoard(newBoard);
    setSwapCount(swapCount + 1);
    
    // Add to history
    setHistory([...history, {
      board: JSON.parse(JSON.stringify(newBoard)),
      swapCount: swapCount + 1
    }]);
  };
  
  // Drag and drop handlers
  const handleDragStart = (e, tile, rowIndex, colIndex) => {
    if (!tile || isTileLocked(rowIndex, colIndex)) {
      e.preventDefault();
      return;
    }
    
    // Get the offset of the mouse from the tile's top-left corner
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDraggedTile({ 
      tile, 
      rowIndex, 
      colIndex,
      offsetX,
      offsetY
    });
    
    // Set initial drag position
    setDragPosition({
      x: e.clientX,
      y: e.clientY
    });
    
    // Set a transparent drag image
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  };
  
  const handleDragOver = (e, tile, rowIndex, colIndex) => {
    e.preventDefault();
    if (!tile) return;
    
    // Update drag position
    setDragPosition({
      x: e.clientX,
      y: e.clientY
    });
    
    if (draggedTile) {
      setDragOverTile({ tile, rowIndex, colIndex });
    }
  };
  
  const handleDrag = (e) => {
    e.preventDefault();
    if (e.clientX && e.clientY) {
      setDragPosition({
        x: e.clientX,
        y: e.clientY
      });
    }
  };
  
  const handleDragLeave = () => {
    setDragOverTile(null);
  };
  
  const handleDrop = (e, tile, rowIndex, colIndex) => {
    e.preventDefault();
    if (!tile || !draggedTile || isTileLocked(rowIndex, colIndex)) return;
    
    performSwap(
      draggedTile.rowIndex, 
      draggedTile.colIndex, 
      rowIndex, 
      colIndex
    );
    
    setDraggedTile(null);
    setDragOverTile(null);
  };
  
  // Undo last move
  const undoMove = () => {
    if (history.length > 1) {
      const previousState = history[history.length - 2];
      setBoard(previousState.board);
      setSwapCount(previousState.swapCount);
      setHistory(history.slice(0, -1));
      setSelectedTile(null);
    }
  };
  
  // Reset to initial state
  const resetBoard = () => {
    if (history.length > 0) {
      const initialState = history[0];
      setBoard(initialState.board);
      setSwapCount(0);
      setHistory([initialState]);
      setSelectedTile(null);
      resetLocks();
    }
  };

  // Set up an event listener for drag events on the document
  useEffect(() => {
    const handleDocumentDrag = (e) => {
      if (draggedTile && e.clientX && e.clientY) {
        setDragPosition({
          x: e.clientX,
          y: e.clientY
        });
      }
    };
    
    document.addEventListener('drag', handleDocumentDrag);
    return () => {
      document.removeEventListener('drag', handleDocumentDrag);
    };
  }, [draggedTile]);
  
  // Clean up any unlock timer when unmounting
  useEffect(() => {
    return () => {
      if (unlockTimerRef.current) {
        clearTimeout(unlockTimerRef.current);
      }
    };
  }, []);

  // Initialize with a default waffle for demonstration
  useEffect(() => {
    if (inputText === '' && board.length === 0) {
      setInputText('bnoad/ipl/aarli/acn/lskmy');
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Waffle Game Solve Helper</h1>
      
      <div className="w-full">
        <div className="flex items-center mb-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter board state (e.g., bnoad/ipl/aarli/acn/lskmy)"
            className="flex-1 p-2 border rounded"
          />
          <button 
            onClick={() => parseInput(inputText)}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Initialize
          </button>
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          Format: 5 letters / 3 letters / 5 letters / 3 letters / 5 letters
        </div>
      </div>
      
      {/* Floating dragged tile that follows cursor */}
      {draggedTile && (
        <div 
          className="fixed pointer-events-none z-50 w-12 h-12 flex items-center justify-center font-bold text-xl rounded shadow-md opacity-90"
          style={{
            backgroundColor: draggedTile.tile.color,
            top: dragPosition.y - (draggedTile.offsetY || 20),
            left: dragPosition.x - (draggedTile.offsetX || 20)
          }}
        >
          <span className={draggedTile.tile.color === '#f5f5f5' ? 'text-black' : 'text-white'}>
            {draggedTile.tile.letter}
          </span>
        </div>
      )}
      
      <div className="flex justify-between w-full mb-4">
        <div className="text-lg font-semibold">Swaps: {swapCount}</div>
        <div className="space-x-2">
          <button 
            onClick={undoMove}
            disabled={history.length <= 1}
            className={`px-3 py-1 rounded ${history.length <= 1 ? 'bg-gray-300' : 'bg-yellow-500 text-white hover:bg-yellow-600'}`}
          >
            Undo
          </button>
          <button 
            onClick={resetBoard}
            disabled={history.length <= 1 || swapCount === 0}
            className={`px-3 py-1 rounded ${history.length <= 1 || swapCount === 0 ? 'bg-gray-300' : 'bg-red-500 text-white hover:bg-red-600'}`}
          >
            Reset
          </button>
          <button 
            onClick={resetLocks}
            disabled={Object.keys(lockedTiles).length === 0}
            className={`px-3 py-1 rounded ${Object.keys(lockedTiles).length === 0 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Unlock All
          </button>
        </div>
      </div>
      
      <div className="waffle-board w-full max-w-md">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center">
            {row.map((tile, colIndex) => (
              <div 
                key={colIndex} 
                className={`relative ${tile ? 'w-12 h-12 m-1 flex items-center justify-center font-bold text-xl rounded shadow-md cursor-pointer' : 'w-12 h-12 m-1'}`}
                style={tile ? { 
                  backgroundColor: isTileLocked(rowIndex, colIndex) ? '#8BBF6A' : tile.color,
                  transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.2s',
                  transform: dragOverTile && dragOverTile.rowIndex === rowIndex && dragOverTile.colIndex === colIndex ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: (dragOverTile && dragOverTile.rowIndex === rowIndex && dragOverTile.colIndex === colIndex) ? 
                             '0 0 10px rgba(0,0,255,0.5)' : 
                             (isUnlockCandidate(rowIndex, colIndex) ? '0 0 8px rgba(255,0,0,0.7)' : ''),
                  cursor: isTileLocked(rowIndex, colIndex) ? (isUnlockCandidate(rowIndex, colIndex) ? 'pointer' : 'not-allowed') : 'pointer'
                } : {}}
                onClick={() => {
                  if (tile) {
                    if (isUnlockCandidate(rowIndex, colIndex)) {
                      handleUnlockClick(rowIndex, colIndex);
                    } else {
                      handleTileClick(tile, rowIndex, colIndex);
                    }
                  }
                }}
                draggable={!!tile && !isTileLocked(rowIndex, colIndex)}
                onDragStart={(e) => tile && handleDragStart(e, tile, rowIndex, colIndex)}
                onDrag={(e) => handleDrag(e)}
                onDragOver={(e) => tile && handleDragOver(e, tile, rowIndex, colIndex)}
                onDragLeave={() => handleDragLeave()}
                onDrop={(e) => tile && handleDrop(e, tile, rowIndex, colIndex)}
              >
                {tile && (
                  <span className={`${tile.color === '#f5f5f5' ? 'text-black' : 'text-white'} ${draggedTile && draggedTile.rowIndex === rowIndex && draggedTile.colIndex === colIndex ? 'opacity-0' : ''}`}>
                    {tile.letter}
                  </span>
                )}
                {selectedTile && selectedTile.rowIndex === rowIndex && selectedTile.colIndex === colIndex && (
                  <div className="absolute inset-0 border-2 border-blue-500 rounded"></div>
                )}
                {isUnlockCandidate(rowIndex, colIndex) && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium bg-black bg-opacity-50 rounded pointer-events-none">
                    <span>Click to unlock</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {selectedTile && (
        <div className="mt-2 text-blue-600">
          Selected: {selectedTile.tile.letter} (click another tile to swap)
        </div>
      )}
      
      <div className="text-sm text-gray-600 mt-4">
        <p>Instructions:</p>
        <ul className="list-disc pl-5">
          <li>Enter the initial board state using the format above</li>
          <li>Click "Initialize" to set up the board</li>
          <li>Drag and drop tiles to swap them</li>
          <li>Or click one tile, then another to swap them</li>
          <li>Click a <strong>selected</strong> tile again to lock it (locked tiles turn green)</li>
          <li>Click a <strong>locked</strong> tile to see "Click to unlock" option</li>
          <li>Use Undo and Reset buttons to manage your moves</li>
        </ul>
      </div>
    </div>
  );
};

export default WaffleHelper;

export const metadata = {
  title: "🧇 Waffle Game Solve Helper",
  description: "Interactive helper for solving Waffle word puzzles with drag-and-drop tile swapping, locking system, and move tracking",
  type: "react",
  tags: ["game","puzzle","word-game","helper","interactive"],
  folder: "games",
  createdAt: "2025-01-07T19:30:00Z",
  updatedAt: "2025-01-07T19:30:00Z",
} as const;
