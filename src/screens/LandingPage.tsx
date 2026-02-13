import { ChefHat, Monitor } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navi = useNavigate();
  return (
    <div className="min-h-screen w-full  flex flex-col items-center justify-center ">
      {/* Header */}
      <div className="text-center max-w-3xl">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800">
          POS Online
        </h1>
        <p className="mt-3 text-sm sm:text-base lg:text-lg text-gray-500">
          Kitchen Display System & Customer Order Tracking
        </p>
      </div>

      {/* Cards */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-10 w-full max-w-6xl">
        {/* ================= Kitchen Display ================= */}
        <div
          className="
            relative bg-white border rounded-2xl p-6 sm:p-8
            transition-all duration-300 ease-in-out
            hover:-translate-y-1
            hover:border-blue-500
            hover:shadow-[0_10px_35px_rgba(37,99,235,0.15)]
            group
          "
        >
          {/* Watermark */}
          <ChefHat
            className="
              absolute right-6 top-6 w-32 h-32
              text-gray-200
              opacity-70
              transition-opacity duration-300
              group-hover:opacity-100
            "
          />

          {/* Icon */}
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-600 text-white">
            <ChefHat />
          </div>

          <h2 className="mt-5 text-xl sm:text-2xl font-semibold text-gray-800">
            Kitchen Display
          </h2>

          <p className="mt-2 text-gray-500 text-sm sm:text-base max-w-md">
            For kitchen staff. Manage incoming orders, mark prep status, and
            complete tickets.
          </p>

          <button
            className="
              mt-6 inline-flex items-center gap-2
              px-5 py-2.5 border border-gray-300 rounded-lg
              text-sm font-medium
              transition-all duration-300
              hover:bg-blue-600 hover:text-white hover:border-blue-600
              "
            onClick={() => navi("/KitchenDisplay")}
          >
            Enter Kitchen →
          </button>
        </div>

        {/* ================= Order Status ================= */}
        <div
          className="
            relative bg-white border rounded-2xl p-6 sm:p-8
            transition-all duration-300 ease-in-out
            hover:-translate-y-1
            hover:border-green-500
            hover:shadow-[0_10px_35px_rgba(34,197,94,0.15)]
            group
          "
        >
          {/* Watermark */}
          <Monitor
            className="
              absolute right-6 top-6 w-32 h-32
              text-green-200
              opacity-70
              transition-opacity duration-300
              group-hover:opacity-100
            "
          />

          {/* Icon */}
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-green-500 text-white">
            <Monitor />
          </div>

          <h2 className="mt-5 text-xl sm:text-2xl font-semibold text-gray-800">
            Order Status
          </h2>

          <p className="mt-2 text-gray-500 text-sm sm:text-base max-w-md">
            For customers. View order progress and see when your food is ready
            for pickup.
          </p>

          <button
            className="
              mt-6 inline-flex items-center gap-2
              px-5 py-2.5 border border-gray-300 rounded-lg
              text-sm font-medium
              transition-all duration-300
              hover:bg-green-500 hover:text-white hover:border-green-500
            "
            onClick={() => navi("/OrderStatus")}
          >
            View Status Board →
          </button>
        </div>
      </div>
    </div>
  );
}
