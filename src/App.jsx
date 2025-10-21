

import { useEffect } from 'react';

import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';
import { SidebarProvider } from './components/sidebar/SidebarManager';
import { ModalProvider } from './contexts/ModalContext';
import { ChessProvider } from './contexts/ChessContext';


const App = () => {
  useEffect(() => {
      console.log(`yerr`)
  }, []);
  return (
    <ChessProvider>
      <ModalProvider>
        <SidebarProvider>
            <Header />
            <Body />
            <Footer />
        </SidebarProvider>
      </ModalProvider>
    </ChessProvider>
  );
}

export default App