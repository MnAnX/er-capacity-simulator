import React from 'react';

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';

import Config from './Config'
import Control from './Control'
import Summary from './Summary'
import AllUnits from './AllUnits'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: blue,
    secondary: green,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <h1>COVID-19: ER Capacity Simulator</h1>
        <Container>
          <Paper>
            <Container>
              <h2>Configuration</h2>
              <br />
              <Config />
            </Container>
          </Paper>
        </Container>
        <Container>
          <Paper>
            <Container>
              <h2>Run Simulation</h2>
              <Control />
              <br />
              <Summary />
              <br />
              <AllUnits />
            </Container>
          </Paper>
        </Container>
      </Container>
    </ThemeProvider>
  );
}

export default App;
