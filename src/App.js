import React from 'react';

import GridList from '@material-ui/core/GridList';

import Control from './Control'
import EmergencyRoom from './EmergencyRoom'

function App() {
  return (
    <div>
      <h1>COVID-19: ER Capacity Simulation</h1>
      <Control />
      <GridList cellHeight={160} cols={3}>
        {[1,2].map(tile => (
          <EmergencyRoom
            id="123"
            init_status="Normal"
          />
        ))}
      </GridList>
    </div>
  );
}

export default App;
