import * as Tooltip from '@radix-ui/react-tooltip';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Library,
  BookmarkPlus,
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: <BookOpen className="w-4 h-4" />, label: 'Découvrir', path: '/Lives' },
  ];

  return (
    <aside className="sticky top-[64px]  top-16 left-0  w-16 bg-gray-900 border-r border-blue-500/10 flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <div className="mb-8">
        <Tooltip.Provider delayDuration={100}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Link 
                to="/" 
                className="w-9 h-9 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl flex items-center justify-center hover:from-blue-500/30 hover:to-blue-600/20 transition-all duration-200"
              >
                <Library className="w-5 h-5 text-blue-400" />
              </Link>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="px-3 py-1.5 text-sm font-medium text-gray-200 bg-gray-900/95 rounded-lg shadow-xl backdrop-blur-sm border border-blue-800/50"
                side="right"
                sideOffset={10}
              >
                BOOK LIBRARY
                <Tooltip.Arrow className="fill-gray-900/95" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>

      {/* Menu principal */}
      <nav className="flex flex-col items-center space-y-5 flex-1">
        {menuItems.map((item, index) => (
          <Tooltip.Provider key={index} delayDuration={100}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Link
                  to={item.path}
                  className={`relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 group ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-400 shadow-inner'
                      : 'text-gray-400 hover:bg-blue-500/10 hover:text-blue-400'
                  }`}
                >
                  {item.icon}
                  {location.pathname === item.path && (
                    <span className="absolute -left-1 h-5 w-1 bg-blue-500 rounded-r-full transition-all duration-300" />
                  )}
                </Link>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="px-3 py-1.5 text-sm font-medium text-gray-200 bg-gray-900/95 rounded-lg shadow-xl backdrop-blur-sm border border-blue-800/50"
                  side="right"
                  sideOffset={10}
                >
                  {item.label}
                  <Tooltip.Arrow className="fill-gray-900/95" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        ))}
      </nav>

      {/* Bouton Nouvelle Collection */}
      <div className="pt-4">
        <Tooltip.Provider delayDuration={100}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Link 
                to="/nouvelle-collection" 
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-200 group"
              >
                <BookmarkPlus className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              </Link>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="px-3 py-1.5 text-sm font-medium text-gray-200 bg-gray-900/95 rounded-lg shadow-xl backdrop-blur-sm border border-blue-800/50"
                side="right"
                sideOffset={10}
              >
                Nouvelle Collection
                <Tooltip.Arrow className="fill-gray-900/95" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </aside>
  );
};

export default Sidebar;