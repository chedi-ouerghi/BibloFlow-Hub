import React from 'react';
import HeroSection from '../components/_components/HeroSection';

const Home = ({user,handleLogout}) => {
  return (
    <main className="flex-1">
      <HeroSection user={user} handleLogout={handleLogout} />
    </main>
  );
};

export default Home;