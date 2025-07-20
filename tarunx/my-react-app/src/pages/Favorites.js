import React from 'react';
import Home from './Home';

function Favorites(props) {
  return <Home {...props} favoritesOnly={true} />;
}

export default Favorites; 