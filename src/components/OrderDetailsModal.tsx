import { X } from "lucide-react";
import OrderItemsTable from "./OrderItemsTable";
import { markItemPickUp, type KotOrder } from "../api/endpoints";
import { Bell } from "lucide-react";
type Props = {
  open: boolean;
  orderNo: string;
  items: KotOrder[]; // Use proper type
  onClose: () => void;
  onRefresh?: () => void; // optional refresh callback
};

export default function OrderDetailsModal({
  open,
  orderNo,
  items,
  onClose,
  onRefresh,
}: Props) {
  if (!open) return null;

  // Map KotOrder to API pickup shape
  const mapToPickupModel = (item: KotOrder) => ({
    Kot: Number(item.KotNo), // or item.Count depending on API
    Code: item.ItemCode,
    MyProperty: "", // adjust if needed
    Qty: item.Qty,
    Time: item.KotTime,
    Barked: true, // convert string "0"/"1" to boolean
    Ready: true,
    Picked: true,
    Cmnts: item.Cmnt || "",
  });
  const handlePickUp = async () => {
    try {
      const apiModels = items.map(mapToPickupModel);

      await Promise.all(apiModels.map((item) => markItemPickUp(item)));

      // ✅ Get order number (assuming same KOT)
      const kotNo = items[0]?.KotNo;

      // 🔊 VOICE ANNOUNCEMENT
      if (kotNo) {
        const utterance = new SpeechSynthesisUtterance(
          `Order number ${kotNo} picked up`,
        );
        utterance.lang = "en-IN";
        utterance.rate = 0.9;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }

      if (onRefresh) onRefresh();
      onClose();
    } catch (error) {
      console.error("Error picking up items:", error);
      alert("Failed to mark items as picked up. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-6xl rounded-xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            ORDER DETAILS - #{orderNo}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <OrderItemsTable
            handlePickUp={handlePickUp}
            onRefresh={onRefresh}
            items={items}
          />
        </div>

        {/* Footer */}
        <div className="flex gap-2 justify-center pb-6">
          <button
            onClick={handlePickUp}
            className="
              bg-red-600 text-white font-semibold
              px-10 py-3 rounded-lg shadow-md
              hover:bg-red-700
            "
          >
            PICKUP ORDER
          </button>
          <button
            className="
    flex items-center gap-2
    bg-yellow-500 text-black font-semibold
    px-10 py-3 rounded-lg shadow-md
    hover:bg-yellow-600
    transition duration-200
  "
          >
            <Bell size={20} />
            BELL
          </button>
        </div>
      </div>
    </div>
  );
}
