import React from 'react';
import Hero from './Hero';
import GenderCollectionSection from '../components/Products/GenderCollectionSection';
import NewArrivals from '../components/Products/NewArrivals';
import BestSellers from '../components/Products/BestSellers';
import YouMayAlsoLike from '../components/Products/YouMayAlsoLike';
import TopWearsForWomen from '../components/Products/TopWearsForWomen';
import FeaturedSection from '../components/Products/FeaturedSection';
import FeaturesSection from '../components/Products/FeaturesSection';

const Home = () => {
  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />
      
      {/* Moved Women's Section Higher for better prominence */}
      <TopWearsForWomen />
      
      {/* Best Seller Dynamic View */}
      <BestSellers />
      
      {/* Recommendations */}
      <YouMayAlsoLike />
      
      <FeaturedSection />
      <FeaturesSection />
    </div>
  );
};

export default Home;
