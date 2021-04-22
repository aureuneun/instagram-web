import React from 'react';
import { useHistory } from 'react-router';
import { logUserOut } from '../apollo';
import routes from '../routes';

const Home = () => {
  const history = useHistory();
  return (
    <div>
      <h1>Home</h1>
      <button
        onClick={() => {
          logUserOut();
          history.replace(routes.home);
        }}
      >
        Log out now!
      </button>
    </div>
  );
};

export default Home;
