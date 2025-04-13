import SimpleColorPicker from './SimpleColorPicker';

export default function Sidebar({
  boards,
  activeBoard,
  setActiveBoard,
  addElement,
  selectedElement,
  setSelectedElement,
  isTextEditing,
  setIsTextEditing,
  changeBoardColor,
  showColorPicker,
  setShowColorPicker,
  addNewBoard,
  deleteElement,
}) {
  const currentBoard = boards.find(board => board.id === activeBoard);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      addElement('image', imageUrl);
    }
  };

  return (
    <div className="w-72 bg-white shadow-lg rounded-xl p-6 flex flex-col space-y-6 text-gray-800">
      {/* Boards Section */}
      <div>
        <h2 className="text-xl font-bold mb-3">Your Boards</h2>
        <div className="space-y-2">
          {boards.map(board => (
            <div
              key={board.id}
              className={`p-2 rounded cursor-pointer hover:bg-gray-100 transition ${
                board.id === activeBoard ? 'bg-blue-100 font-semibold' : ''
              }`}
              onClick={() => setActiveBoard(board.id)}
            >
              {board.title}
            </div>
          ))}
        </div>
        <button
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
          onClick={addNewBoard}
        >
          + New Board
        </button>
      </div>

      {/* Add Elements */}
      <div>
        <h2 className="text-xl font-bold mb-3">Add Elements</h2>
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => addElement('image')}
            className="bg-gray-100 hover:bg-gray-200 py-2 rounded-lg transition"
          >
            Image
          </button>
          <button
            onClick={() => addElement('text')}
            className="bg-gray-100 hover:bg-gray-200 py-2 rounded-lg transition"
          >
            Text
          </button>
          <button
            onClick={() => addElement('color')}
            className="bg-gray-100 hover:bg-gray-200 py-2 rounded-lg transition"
          >
            Color
          </button>
          <label className="bg-gray-100 hover:bg-gray-200 py-2 rounded-lg text-center cursor-pointer transition">
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Board Settings */}
      <div>
        <h2 className="text-xl font-bold mb-3">Board Settings</h2>
        <div className="flex items-center space-x-3 mb-3">
          <span>Background:</span>
          <div
            className="w-8 h-8 rounded border cursor-pointer shadow-inner"
            style={{ backgroundColor: currentBoard?.backgroundColor || '#fff' }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          />
        </div>
        {showColorPicker && !selectedElement && currentBoard && (
          <SimpleColorPicker
            color={currentBoard.backgroundColor}
            onChange={changeBoardColor}
          />
        )}
      </div>

      {/* Selected Element Settings */}
      {selectedElement && (
        <div>
          <h2 className="text-xl font-bold mb-3">Element Properties</h2>
          <button
            onClick={() => deleteElement(selectedElement.id)}
            className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition w-full"
          >
            Delete Element
          </button>
        </div>
      )}
    </div>
  );
}

