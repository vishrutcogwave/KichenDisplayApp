import { BrowserRouter } from "react-router-dom";
import { OrdersRefreshProvider } from "./context/OrdersRefreshContext";
import AppRouter from "./router/AppRouter";

function App() {
  return (
    <OrdersRefreshProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </OrdersRefreshProvider>
  );
}

export default App;
