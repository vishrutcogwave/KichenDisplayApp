

import Header from "../components/Header";
import { ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  loadItems,
  type KotOrder,
  type LoadItemsParams,
} from "../api/endpoints";
import { useOrdersRefresh } from "../context/OrdersRefreshContext";
import StyledNewOrdersBoard from "../components/StyledNewOrdersBoard";
import StyledReadyForPickupBoard from "../components/StyledReadyForPickupBoard";

function OrderStatus() {
  const [ordersData, setOrdersData] = useState<KotOrder[]>([]);
  const prevOrdersRef = useRef<KotOrder[]>([]);
  const announcedReady = useRef<Set<string>>(new Set());
  const isFirstFetch = useRef(true);

  const { refreshKey, setRefreshKey } = useOrdersRefresh();

  const apiParams: LoadItemsParams = {
    flag: 0,
    depcode: 0,
    kotno: "0",
    priority: 0,
    itemcode: "0",
    tblno: "0",
  };

  /* =======================
     TTS Queue System
  ======================= */
  const speechQueue = useRef<string[]>([]);
  const isSpeaking = useRef(false);

  const speak = (text: string) => {
    speechQueue.current.push(text);
    if (!isSpeaking.current) {
      isSpeaking.current = true;
      const nextText = speechQueue.current.shift()!;
      const utterance = new SpeechSynthesisUtterance(nextText);
      utterance.lang = "en-IN";

      utterance.onend = () => {
        if (speechQueue.current.length > 0) {
          const next = speechQueue.current.shift()!;
          speak(next); // recursive call
        } else {
          isSpeaking.current = false;
        }
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  /* =======================
     Fetch orders + READY logic
  ======================= */
  const fetchOrders = async () => {
    try {
      const newData = await loadItems(apiParams);
      const oldData = prevOrdersRef.current;

      if (!isFirstFetch.current) {
        newData.forEach((newItem) => {
          const key = `${newItem.Res}-${newItem.KotNo}-${newItem.Tbl}-${newItem.ItemCode}`;
          const oldItem = oldData.find(
            (o) =>
              o.KotNo === newItem.KotNo &&
              o.Res === newItem.Res &&
              o.Tbl === newItem.Tbl &&
              o.ItemCode === newItem.ItemCode
          );

          // 🔔 READY only
          if (
            oldItem &&
            oldItem.Ready === "0" &&
            newItem.Ready === "1" &&
            !announcedReady.current.has(key)
          ) {
            announcedReady.current.add(key);

            const msg =
              newItem.Res === "FFS"
                ? `Order number ${newItem.KotNo} is ready for pickup`
                : `Table ${newItem.Tbl} order is ready for pickup`;

            speak(msg);
          }
        });
      }

      isFirstFetch.current = false;
      prevOrdersRef.current = newData;
      setOrdersData(newData);
    } catch (err) {
      console.error("Failed to load orders:", err);
    }
  };

  /* =======================
     Poll every 5 seconds
  ======================= */
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  /* =======================
     Refresh when refreshKey changes
  ======================= */
  useEffect(() => {
    fetchOrders();
  }, [refreshKey]);

  /* =======================
     Cross-tab refresh
  ======================= */
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "orders_refresh") {
        setRefreshKey((prev) => prev + 1);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [setRefreshKey]);

  return (
 <div className="min-h-screen w-full bg-gray-50 flex flex-col">
  {/* Fixed Header */}
  <div className="sticky top-0 z-50 bg-gray-50">
    <Header
      title="ORDER STATUS"
      subtitle="Live updates of incoming orders"
      icon={<ShoppingCart className="w-full h-full" />}
    />
  </div>

  {/* Scrollable content */}
  <div className="flex-1 overflow-auto p-4 space-y-6">
    <div className="p-6 bg-white rounded shadow">
      <StyledNewOrdersBoard
        data={ordersData
          .filter((item) => item.Picked === "0")
          .sort((a, b) => {
            const kotDiff = Number(a.KotNo) - Number(b.KotNo);
            return kotDiff !== 0 ? kotDiff : a.Priority - b.Priority;
          })}
      />
    </div>

    <div className="p-6 bg-white rounded shadow">
      <StyledReadyForPickupBoard data={ordersData} />
    </div>
  </div>
</div>

  );
}

export default OrderStatus;
