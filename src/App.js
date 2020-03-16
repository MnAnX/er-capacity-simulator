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
            <h2>Configuration</h2>
            <Config />
          </Paper>
        </Container>
        <Container>
          <Paper>
            <h2>Run Simulation</h2>
            <Summary />
            <br />
            <Control />
            <br />
            <AllUnits />
          </Paper>
        </Container>
      </Container>
    </ThemeProvider>
  );
}

export default App;
