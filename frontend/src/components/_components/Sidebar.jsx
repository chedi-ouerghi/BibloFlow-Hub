import * as Tooltip from '@radix-ui/react-tooltip';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Library,
  BookmarkPlus,
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: <BookOpen className="w-4 h-4" />, label: 'Découvrir', path: '/Lives' },
  ];

  return (
    <aside className="sticky top-[64px] h-[calc(100vh-64px)] w-16 bg-[#0a0a0a] border-r border-beige/10 flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <div className="mb-8">
        <Tooltip.Provider delayDuration={100}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild active>
              <Link 
                to="/" 
                className="w-9 h-9 bg-gradient-to-br from-beige/20 to-beige/10 rounded-xl flex items-center justify-center
                hover:from-beige/30 hover:to-beige/20 transition-all duration-200"
              >
                <Library className="w-5 h-5 text-beige" />
              </Link>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900/95 rounded-lg shadow-xl backdrop-blur-sm border border-gray-800"
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
                  className={`relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 group
                    ${item.active
                      ? 'bg-gradient-to-br from-beige/20 to-beige/10 text-beige shadow-inner'
                      : 'text-gray-400 hover:bg-beige/5 hover:text-beige'
                    }`}
                >
                  {item.icon}
                  {item.active && (
                    <span className="absolute -left-1 h-5 w-1 bg-beige rounded-r-full transition-all duration-300" />
                  )}
                </Link>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900/95 rounded-lg shadow-xl backdrop-blur-sm border border-gray-800"
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
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 
                hover:bg-beige/5 hover:text-beige transition-all duration-200 group"
              >
                <BookmarkPlus className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              </Link>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900/95 rounded-lg shadow-xl backdrop-blur-sm border border-gray-800"
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