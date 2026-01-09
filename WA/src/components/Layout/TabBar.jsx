import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CubeIcon,
  ShoppingBagIcon,
  UsersIcon,
  TagIcon,
  TruckIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  CubeIcon as CubeIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
  UsersIcon as UsersIconSolid,
  TagIcon as TagIconSolid,
  TruckIcon as TruckIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from '@heroicons/react/24/solid';

const tabs = [
  {
    name: 'Dashboard',
    href: '/',
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
  },
  {
    name: 'Sản phẩm',
    href: '/products',
    icon: CubeIcon,
    iconSolid: CubeIconSolid,
  },
  {
    name: 'Đơn hàng',
    href: '/orders',
    icon: ShoppingBagIcon,
    iconSolid: ShoppingBagIconSolid,
  },
  {
    name: 'Khuyến mãi',
    href: '/promotions',
    icon: TagIcon,
    iconSolid: TagIconSolid,
  },
  {
    name: 'Khách hàng',
    href: '/users',
    icon: UsersIcon,
    iconSolid: UsersIconSolid,
  },
  {
    name: 'Vận chuyển',
    href: '/shipping-methods',
    icon: TruckIcon,
    iconSolid: TruckIconSolid,
  },
  {
    name: 'Cài đặt',
    href: '/settings',
    icon: Cog6ToothIcon,
    iconSolid: Cog6ToothIconSolid,
  },
];

export default function TabBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = currentPath === tab.href || (tab.href !== '/' && currentPath.startsWith(tab.href));
          const Icon = isActive ? tab.iconSolid : tab.icon;
          
          return (
            <Link
              key={tab.name}
              to={tab.href}
              className={`
                flex flex-col items-center justify-center min-w-[70px] h-full px-2
                transition-all duration-200 flex-shrink-0
                ${isActive 
                  ? 'text-primary-600' 
                  : 'text-gray-500 hover:text-gray-700 active:scale-95'
                }
              `}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className={`text-[10px] font-medium text-center leading-tight ${isActive ? 'font-semibold' : ''}`}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
