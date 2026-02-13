import { Route, Routes } from "react-router-dom";
import LandingPage from "../screens/LandingPage";
import KitchenDisplay from "../screens/KitchenDisplay";
import OrderStatus from "../screens/OrderStatus";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/KitchenDisplay" element={<KitchenDisplay />} />
      <Route path="/OrderStatus" element={<OrderStatus />} />
    </Routes>
  );
}

export default AppRouter;
