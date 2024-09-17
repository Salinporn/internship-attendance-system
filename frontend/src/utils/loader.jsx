import React from 'react';
import { DNA } from 'react-loader-spinner';
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme } from '../components/style.js'; 

export const LoaderComponent = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)' 
      }}>
        <DNA
          visible={true}
          height="120"
          width="120"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper"
        />
      </div>
    </ThemeProvider>
  );
};