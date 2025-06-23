import { Server, User, LogOut } from 'lucide-react';

const TopNavBar = () => (
  <nav className="bg-white border-b border-slate-200 px-6 py-4">
    <div className="flex items-center justify-between max-w-7xl mx-auto">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
            <Server className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Logwise</h1>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-slate-600" />
          </div>
          <span className="text-sm font-medium text-slate-700">john@company.com</span>
        </div>
        <button className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  </nav>
);

export default TopNavBar;