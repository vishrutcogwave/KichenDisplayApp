// components/ReadyForPickupBoard.tsx
import { ClipboardList } from "lucide-react";
import OrderCard from "./OrderCard";

type ApiItem = {
  Res: string;
  Tbl: string;
  KotNo: string;
  Ready: string;
  Picked: string;
};

type Props = {
  data: ApiItem[];
};

export default function ReadyForPickupBoard({ data }: Props) {
  // Filter orders that are Ready === "1" and Picked === "0"
  const filteredData = data.filter(
    (item) => item.Ready === "1" && item.Picked === "0",
  );

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
        <ClipboardList className="w-5 h-5 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-800">
          Ready for Pickup
        </h2>
      </div>

      {/* Grid */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderCard
              key={`${order.type}-${order.value}`}
              label={order.label}
              onClick={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No orders ready for pickup.
          </p>
        )}
      </div>
    </div>
  );
}
