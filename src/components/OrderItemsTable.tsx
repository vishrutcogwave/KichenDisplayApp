import { useEffect, useState } from "react";
import { markItemReady, type KotOrder } from "../api/endpoints";
import { useOrdersRefresh } from "../context/OrdersRefreshContext";

type Props = {
  items: KotOrder[];
  onRefresh?: () => void;
  handlePickUp?:()=>void
};

export default function KotOrdersTable({ items, onRefresh }: Props) {
  const [barkingIndex, setBarkingIndex] = useState<number | null>(null);
  const [loadingKot, setLoadingKot] = useState<string | null>(null);
  const { setRefreshKey } = useOrdersRefresh();

  /* ---------------- PAGINATION ---------------- */
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------------- FILTER ---------------- */
  const filteredItems = (items || []).filter(
    (item) => item.Ready === "0" && item.Picked === "0",
  );

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  /* 🔥 KEY FIX: DO NOT reset page on polling */
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages, currentPage]);

  /* Optional UX: if page becomes empty, go back */
  useEffect(() => {
    if (paginatedItems.length === 0 && currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  }, [paginatedItems.length, currentPage]);

  /* ---------------- UTILS ---------------- */
  const numberToWords = (num: number): string => {
    const ones = [
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
    ];
    const tens = [
      "",
      "",
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety",
    ];

    if (num < 20) return ones[num];
    if (num < 100)
      return (
        tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "")
      );
    if (num < 1000)
      return (
        ones[Math.floor(num / 100)] +
        " hundred" +
        (num % 100 ? " " + numberToWords(num % 100) : "")
      );

    return num.toString();
  };

  const speakItem = (qty: number, itemName: string) => {
    const utterance = new SpeechSynthesisUtterance(
      `${numberToWords(qty)} ${itemName.toLowerCase()}`,
    );
    utterance.lang = "en-IN";
    utterance.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  /* ---------------- ACTIONS ---------------- */
  const handleBark = (index: number, item: KotOrder) => {
    speakItem(item.Qty, item.Item);
    setBarkingIndex(index);
    setTimeout(() => setBarkingIndex(null), 3000);
  };

  const handleReady = async (item: KotOrder) => {
    try {
      setLoadingKot(item.KotNo);

      await markItemReady(item);

      setRefreshKey((prev) => prev + 1);
      onRefresh?.();
      localStorage.setItem("orders_refresh", Date.now().toString());

      if (item.Res === "FFS") {
        const utterance = new SpeechSynthesisUtterance(
          `Order number ${item.Tbl} is ready`,
        );
        utterance.lang = "en-IN";
        utterance.rate = 0.9;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to mark item as ready");
    } finally {
      setLoadingKot(null);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100 text-gray-600 text-sm">
          <tr>
            <th className="p-3 text-left">RES</th>
            <th className="p-3 text-left">TBL</th>
            <th className="p-3 text-left">ITEM</th>
            <th className="p-3 text-center">QTY</th>
            <th className="p-3 text-left">CMNT</th>
            <th className="p-3 text-center">KOT</th>
            <th className="p-3 text-center">ACTION</th>
          </tr>
        </thead>

        <tbody>
          {paginatedItems.map((item, index) => (
            <tr
              key={`${item.KotNo}-${index}`}
              className={`border-t text-sm ${
                barkingIndex === index ? "blink-yellow" : ""
              }`}
            >
              <td className="p-3 text-blue-600 font-semibold">{item.Res}</td>
              <td className="p-3">{item.Tbl}</td>
              <td className="p-3 font-semibold">{item.Item}</td>
              <td className="p-3 text-center">
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {item.Qty}
                </span>
              </td>
              <td className="p-3 text-gray-500">{item.Cmnt ?? "-"}</td>
              <td className="p-3 text-center text-gray-500">{item.KotNo}</td>
              <td className="p-3 text-center space-x-2">
                <button
                  onClick={() => handleBark(index, item)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                >
                  BARK
                </button>

                <button
                  onClick={() => handleReady(item)}
                  disabled={loadingKot === item.KotNo}
                  className="px-3 py-1 bg-green-600 text-white rounded text-xs disabled:opacity-50"
                >
                  {loadingKot === item.KotNo ? "WAIT..." : "READY"}
                </button>
              </td>
            </tr>
          ))}

          {filteredItems.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center p-4 text-gray-500">
                No pending orders
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded text-sm disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
