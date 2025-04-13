export default function Header() {
    return (
      <header className="bg-white shadow px-6 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-600">MoodBoarder</h1>
        <div className="flex space-x-4">
          <button className="flex items-center text-gray-700 hover:text-purple-600">Save</button>
          <button className="flex items-center text-gray-700 hover:text-purple-600">Share</button>
          <button className="flex items-center text-gray-700 hover:text-purple-600">Export</button>
        </div>
      </header>
    );
  }