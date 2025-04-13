// src/components/MoodBoarder.jsx
import { useState, useRef } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Canvas from './Canvas';

export default function MoodBoarder() {
  const [boards, setBoards] = useState([
    {
      id: 'board-1',
      title: 'My First Moodboard',
      backgroundColor: '#f8f9fa',
      elements: []
    }
  ]);


  const addNewBoard = () => {
    const newBoard = {
      id: `board-${Date.now()}`,
      title: `New Board`,
      backgroundColor: '#ffffff',
      elements: []
    };
    setBoards([...boards, newBoard]);
    setActiveBoard(newBoard.id);
  };
  
  const [activeBoard, setActiveBoard] = useState('board-1');
  const [selectedElement, setSelectedElement] = useState(null);
  const [isTextEditing, setIsTextEditing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const editingRef = useRef(null);

  const currentBoard = boards.find(board => board.id === activeBoard);

  const addElement = (newElement) => {
    setBoards(prevBoards =>
      prevBoards.map(board =>
        board.id === activeBoard
          ? { ...board, elements: [...board.elements, newElement] }
          : board
      )
    );
  };

  const changeBoardColor = (color) => {
    setBoards(prevBoards =>
      prevBoards.map(board =>
        board.id === activeBoard
          ? { ...board, backgroundColor: color }
          : board
      )
    );
  };

  const handleMouseDown = () => {};
  const handleMouseMove = () => {};
  const handleMouseUp = () => {};
  const handleResize = () => {};

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1 overflow-hidden">

        <Sidebar 
          boards={boards} 
          activeBoard={activeBoard} 
          setActiveBoard={setActiveBoard} 
          addNewBoard={addNewBoard} // ✅ Add this line
          addElement={addElement} 
          selectedElement={selectedElement} 
          setSelectedElement={setSelectedElement} 
          isTextEditing={isTextEditing} 
          setIsTextEditing={setIsTextEditing} 
          changeBoardColor={changeBoardColor} 
          showColorPicker={showColorPicker} 
          setShowColorPicker={setShowColorPicker} 
        />

<Canvas
  currentBoard={currentBoard}
  selectedElement={selectedElement}
  setSelectedElement={setSelectedElement}
  isTextEditing={isTextEditing}
  setIsTextEditing={setIsTextEditing}
  handleMouseDown={handleMouseDown}
  handleMouseMove={handleMouseMove}
  handleMouseUp={handleMouseUp}
  handleResize={handleResize}
  editingRef={editingRef}
  canvasSize={{ width: 800, height: 600 }} // ✅ Ensure canvasSize is passed correctly
/>



      </div>
    </div>
  );
}
