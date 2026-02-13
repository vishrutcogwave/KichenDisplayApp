//
// components/NewOrdersBoard.tsx
import { ClipboardList } from "lucide-react";
import OrderCard from "./OrderCard";

type ApiItem = {
  Res: string;
  Tbl: string;
  KotNo: string;
  Picked?: string; // added Picked for filtering
};

type Props = {
  data: ApiItem[];
  onSelectOrder?: (order: { type: "FFS" | "FAS"; value: string }) => void;
};

export default function NewOrdersBoard({ data, onSelectOrder }: Props) {
  // Filter orders where Picked === "0"
  const filteredData = data.filter((item) => item.Picked === "0");

  const map = new Map<
    string,
    { type: "FFS" | "FAS"; value: string; label: string }
  >();

  filteredData.forEach((item) => {
    if (item.Res === "FFS") {
      map.set(`FFS-${item.KotNo}`, {
        type: "FFS",
        value: item.KotNo,
        label: `OrderNo ${item.KotNo}`,
      });
    }

    if (item.Res === "FAS") {
      map.set(`FAS-${item.Tbl}`, {
        type: "FAS",
        value: item.Tbl,
        label: `Table ${item.Tbl}`,
      });
    }
  });

  const orders = Array.from(map.values());
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <ClipboardList className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">New Orders</h2>
      </div>

      {/* Empty state */}
      {orders.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No new orders</div>
      ) : (
        /* Grid */
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
          {orders.map((order) => (
            <OrderCard
              key={`${order.type}-${order.value}`}
              label={order.label}
              onClick={() =>
                onSelectOrder?.({
                  type: order.type,
                  value: order.value,
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
