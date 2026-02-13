type KitchenLoaderProps = {
  text?: string;
  size?: number;
  compact?: boolean;
};

export default function KitchenLoader({
  text = "Loading...",
  size = 1,
  compact = false,
}: KitchenLoaderProps) {
  return (
    <div
      className={`flex ${
        compact ? "flex-row" : "flex-col"
      } items-center justify-center gap-2`}
      style={{ transform: `scale(${size})` }}
    >
      {/* Animation */}
      <div className="relative w-[40px] h-[40px]">
        {/* Pan */}
        <div className="absolute bottom-[8px] left-[6px] w-[28px] h-[6px] bg-gray-800 rounded-full animate-[panMove_1.2s_ease-in-out_infinite]">
          <div className="absolute right-[-10px] top-[2px] w-[10px] h-[4px] bg-gray-600 rounded-full" />
        </div>

        {/* Food */}
        <div className="absolute bottom-[14px] left-[16px] w-[8px] h-[8px] bg-yellow-400 rounded-full animate-[foodFlip_1.2s_ease-in-out_infinite]" />
      </div>

      {/* Text (hidden in compact mode) */}
      {!compact && (
        <p className="text-sm font-medium text-gray-600 animate-pulse">
          {text}
        </p>
      )}

      {/* Animations */}
      <style>{`
        @keyframes panMove {
          0%,100% { transform: translateX(0); }
          50% { transform: translateX(6px); }
        }

        @keyframes foodFlip {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
          100% { transform: translateY(0) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
