import { createContext, useContext, useState } from "react";

type OrdersRefreshContextType = {
  refreshKey: number;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
};

const OrdersRefreshContext = createContext<OrdersRefreshContextType | null>(
  null,
);

export const OrdersRefreshProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <OrdersRefreshContext.Provider value={{ refreshKey, setRefreshKey }}>
      {children}
    </OrdersRefreshContext.Provider>
  );
};

export const useOrdersRefresh = () => {
  const ctx = useContext(OrdersRefreshContext);
  if (!ctx)
    throw new Error(
      "useOrdersRefresh must be used inside OrdersRefreshProvider",
    );
  return ctx;
};
