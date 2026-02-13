import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Outlet = {
  id: number;
  code: string;
  name: string;
};

type Props = {
  data: Outlet[];
  value?: Outlet;
  onChange?: (outlet: Outlet) => void;
};

export function OutletDropdown({ data, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Outlet>(
    value ?? data[data.length - 1], // default FASTFOOD
  );

  const handleSelect = (item: Outlet) => {
    setSelected(item);
    setOpen(false);
    onChange?.(item);
  };

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm font-semibold text-white
                   bg-gray-800 px-3 py-1.5 rounded-md hover:bg-gray-700"
      >
        {selected.name}
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-60 rounded-md bg-white shadow-lg z-50">
          {data.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              className={`w-full text-left px-4 py-2 text-sm
                ${
                  item.id === selected.id
                    ? "bg-blue-50 font-semibold"
                    : "hover:bg-gray-100"
                }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
