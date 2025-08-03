// If this file only provides context logic, ensure all UI in consumers uses the beach theme (see other components for style). If you add any UI here, use MUI and the beach theme.
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Add more global state as needed

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

// All UI should use the beach theme (see other components for style)
export default AppContext; 