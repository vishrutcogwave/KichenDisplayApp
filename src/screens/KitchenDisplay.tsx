import { useEffect, useState } from "react";
import Header from "../components/Header";
import NewOrdersBoard from "../components/NewOrdersBoard";
import OrderDetailsModal from "../components/OrderDetailsModal";
import { CookingPot } from "lucide-react";
import {
  loadItems,
  type KotOrder,
  type LoadItemsParams,
} from "../api/endpoints";

function KitchenDisplay() {
  const [ordersData, setOrdersData] = useState<KotOrder[]>([]);

  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<KotOrder[]>([]);
  const [orderTitle, setOrderTitle] = useState("");

  const apiParams: LoadItemsParams = {
    flag: 0,
    depcode: 0,
    kotno: "0",
    priority: 0,
    itemcode: "0",
    tblno: "0",
  };

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      const data = await loadItems(apiParams);
      setOrdersData(data);
      console.log("datadata", data);
    } catch (err) {
      console.error("Failed to load orders", err);
    }
  };

  // Initial fetch + polling every 10 seconds
  useEffect(() => {
    fetchOrders(); // initial fetch

    const interval = setInterval(() => {
      fetchOrders();
    }, 5000); // poll every 10s

    return () => clearInterval(interval);
  }, []);

  // Update selected items whenever modal opens or ordersData changes
  useEffect(() => {
    if (!open || !orderTitle) return;

    let type: "FFS" | "FAS" = orderTitle.startsWith("Order") ? "FFS" : "FAS";
    let value: string;

    if (type === "FFS") {
      // Extract numeric order number
      value = orderTitle.replace(/\D/g, "");
    } else {
      // Extract table identifier (letter/number)
      value = orderTitle.replace("Table ", "").trim();
    }

    const filtered = ordersData.filter((item) =>
      type === "FFS"
        ? item.Res === "FFS" && item.KotNo === value
        : item.Res === "FAS" && item.Tbl === value,
    );

    setSelectedItems(filtered);
  }, [ordersData, open, orderTitle]);

  const handleSelectOrder = ({
    type,
    value,
  }: {
    type: "FFS" | "FAS";
    value: string;
  }) => {
    let filtered: KotOrder[] = [];

    if (type === "FFS") {
      filtered = ordersData.filter(
        (item) => item.Res === "FFS" && item.KotNo === value,
      );
      setOrderTitle(`Order ${value}`);
    }

    if (type === "FAS") {
      filtered = ordersData.filter(
        (item) => item.Res === "FAS" && item.Tbl === value,
      );
      setOrderTitle(`Table ${value}`);
    }

    setSelectedItems(filtered);
    setOpen(true);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Header
        title="KITCHEN DISPLAY"
        subtitle="Live orders in progress"
        icon={<CookingPot className="w-full h-full" />}
      />

      {/* Orders Board */}
      <div className="p-6">
        <NewOrdersBoard
          data={ordersData
            .filter((item) => item.Picked === "0") // if you only want unpicked orders
            .sort((a, b) => {
              const kotDiff = Number(a.KotNo) - Number(b.KotNo);
              if (kotDiff !== 0) return kotDiff;
              return a.Priority - b.Priority; // secondary sort by priority
            })}
          onSelectOrder={handleSelectOrder}
        />
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        open={open}
        orderNo={orderTitle}
        items={selectedItems}
        onClose={() => setOpen(false)}
        onRefresh={fetchOrders} // manual refresh from modal
      />
    </div>
  );
}

export default KitchenDisplay;
