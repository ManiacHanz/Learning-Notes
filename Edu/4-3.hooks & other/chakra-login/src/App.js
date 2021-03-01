import React from 'react';
import {
  ChakraProvider,
  Box,
  theme,
} from '@chakra-ui/react';
import Container from './component/Container'

console.log(9, theme)
function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Container />
      </Box>
    </ChakraProvider>
  );
}

export default App;
