
import { useEffect, useState, type ReactNode } from "react";
import { Settings, ChevronDown } from "lucide-react";
import { useOrdersRefresh } from "../context/OrdersRefreshContext";

type Outlet = {
  id: number;
  code: string;
  name: string;
};

type HeaderClockProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
};

const outlets: Outlet[] = [
  { id: 1, code: "BAR", name: "BAR & RESTAURANT" },
  { id: 2, code: "VEG", name: "VEG RESTAURANT" },
  { id: 3, code: "ROOM", name: "ROOM SERVICE" },
  { id: 4, code: "PULI", name: "PULICHAR" },
  { id: 5, code: "PARA", name: "PARADISE BAR" },
  { id: 6, code: "SPA", name: "SPA" },
  { id: 7, code: "FAST", name: "FASTFOOD" },
];

export default function Header({ title, subtitle, icon }: HeaderClockProps) {
  const [time, setTime] = useState("");
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet>(outlets[6]);

  // Settings inputs
  const [serverAddress, setServerAddress] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const { setRefreshKey } = useOrdersRefresh();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      setTime(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")} ${ampm}`,
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load saved settings from localStorage when opening modal
  const openSettings = () => {
    const savedServer = localStorage.getItem("serverAddress") || "";
    const savedBranch = localStorage.getItem("branchCode") || "";
    setServerAddress(savedServer);
    setBranchCode(savedBranch);
    setShowSettings(true);
  };

  const saveSettings = () => {
    // Save settings to localStorage
    localStorage.setItem("serverAddress", serverAddress);
    localStorage.setItem("branchCode", branchCode);

    // Trigger same-tab refresh
    setRefreshKey((prev) => prev + 1);

    // Trigger cross-tab refresh
    localStorage.setItem("orders_refresh", Date.now().toString());

    setShowSettings(false);
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex flex-row justify-between items-center p-3 sm:p-4 md:p-6 lg:p-8 bg-gray-900 shadow-md rounded-md w-full">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-blue-800 text-white flex items-center justify-center">
              {icon}
            </div>
          )}
          <div className="flex flex-col">
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-gray-300">{subtitle}</p>
            )}
            <p className="text-xs text-green-400 mt-1 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1" />
              STATION ACTIVE
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-end">
          {/* TIME */}
          <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-semibold text-white">
            {time}
          </div>

          {/* CONTROLS */}
          <div className="flex items-center gap-2 mt-2">
            {/* Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1 text-sm font-semibold text-white bg-gray-800 px-3 py-1.5 rounded-md hover:bg-gray-700"
              >
                {selectedOutlet.name}
                <ChevronDown size={16} />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-64 rounded-md bg-white shadow-lg z-50">
                  {outlets.map((outlet) => (
                    <button
                      key={outlet.id}
                      onClick={() => {
                        setSelectedOutlet(outlet);
                        setOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        outlet.id === selectedOutlet.id
                          ? "bg-blue-50 font-semibold"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {outlet.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <button
              onClick={openSettings}
              className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-600 hover:text-black"
              >
                CLOSE
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Server Address
                </label>
                <input
                  value={serverAddress}
                  onChange={(e) => setServerAddress(e.target.value)}
                  className="w-full border-b border-gray-300 focus:outline-none py-2"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Branch Code
                </label>
                <input
                  value={branchCode}
                  onChange={(e) => setBranchCode(e.target.value)}
                  className="w-full border-b border-gray-300 focus:outline-none py-2"
                />
              </div>

              <button
                onClick={saveSettings}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold"
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
