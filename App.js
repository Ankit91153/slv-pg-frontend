import React, { useRef, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { store } from "./src/store";
import { queryClient } from "./src/api/queryClient";
import { setNavigationRef, setStoreRef } from "./src/api/axiosConfig";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  const navigationRef = useRef(null);

  useEffect(() => {
    if (navigationRef.current) {
      setNavigationRef(navigationRef.current);
    }
    setStoreRef(store);
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer ref={navigationRef}>
          <AppNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </Provider>
  );
}
