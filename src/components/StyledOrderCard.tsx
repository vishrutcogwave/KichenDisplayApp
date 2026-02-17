
import { CheckCircle, Clock } from "lucide-react";

type Props = {
  label: string;
  onClick: () => void;
  ready: boolean; // shows status badge
};

export default function StyledOrderCard({ label, onClick, ready }: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-xl shadow flex flex-col justify-center items-center
        p-3 w-full h-full text-center
        transition transform hover:scale-105
        ${ready ? "bg-[#FFF9E6] text-gray-900" : "bg-[#FFE5D4] text-gray-900"}
      `}
    >
      {/* Label */}
      <span className=" text-lg font-semibold  tracking-wider">
        {label}
      </span>

      {/* Status Badge */}
      <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold">
        {ready ? (
          <span className="flex items-center gap-1 bg-[#38A169] text-white px-2 py-1 rounded-full animate-fast-pulse">
            <CheckCircle size={16} />
            Ready
          </span>
        ) : (
          <span className="flex items-center gap-1 bg-[#FF8C42] text-white px-2 py-1 rounded-full">
            <Clock size={16} />
            Preparing
          </span>
        )}
      </div>
    </button>
  );
}
