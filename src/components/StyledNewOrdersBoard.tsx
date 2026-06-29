import { ClipboardList } from "lucide-react";
import StyledOrderCard from "./StyledOrderCard";

type ApiItem = {
  Res: string;
  Tbl: string;
  KotNo: string;
  Picked?: string;
  Ready?: string;
};

type Props = {
  data: ApiItem[];
  onSelectOrder?: (order: { type: "FFS" | "FAS"; value: string }) => void;
};

export default function StyledNewOrdersBoard({ data, onSelectOrder }: Props) {
  console.log("data", data);

  // Group items by key (FFS-KotNo or FAS-Tbl)
  const groupedMap = new Map<
    string,
    { type: "FFS" | "FAS"; value: string; items: ApiItem[] }
  >();

  data.forEach((item) => {
    if (item.Picked === "0") {
      if (item.Res === "FFS") {
        const key = `FFS-${item.Tbl}`;
        const existing = groupedMap.get(key);
        if (existing) {
          existing.items.push(item);
        } else {
          groupedMap.set(key, {
            type: "FFS",
            value: item.Tbl,
            items: [item],
          });
        }
      }
      if (item.Res === "FAS") {
        const key = `FAS-${item.Tbl}`;
        const existing = groupedMap.get(key);
        if (existing) {
          existing.items.push(item);
        } else {
          groupedMap.set(key, { type: "FAS", value: item.Tbl, items: [item] });
        }
      }
    }
  });

  // Filter out any group where any item is Ready === "1"
  const orders = Array.from(groupedMap.values())
    .filter((group) => group.items.every((i) => i.Ready === "0"))
    .map((group) => {
      const label =
        group.type === "FFS"
          ? `OrderNo ${group.value}`
          : `Table ${group.value}`;
      return { type: group.type, value: group.value, label };
    });

  console.log(orders, "ordersorders");

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <ClipboardList className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">New Orders</h2>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
        {orders.length > 0 ? (
          orders.map((order) => (
            <StyledOrderCard
              key={`${order.type}-${order.value}`}
              label={order.label}
              ready={false}
              onClick={() =>
                onSelectOrder &&
                onSelectOrder({ type: order.type, value: order.value })
              }
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No new orders.
          </p>
        )}
      </div>
    </div>
  );
}
