import { Plus } from 'lucide-react';

const FloatingActionButton = () => (
  <>
    <button className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
      <Plus className="w-6 h-6" />
      <span className="sr-only">Connect New Project</span>
    </button>

    <div className="fixed bottom-20 right-6 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 pointer-events-none transition-opacity hover:opacity-100">
      Connect New Project
    </div>
  </>
);

export default FloatingActionButton;
