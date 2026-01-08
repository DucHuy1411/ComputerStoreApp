import TabBar from './TabBar';
import Header from './Header';

export default function TabLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
      <TabBar />
    </div>
  );
}

