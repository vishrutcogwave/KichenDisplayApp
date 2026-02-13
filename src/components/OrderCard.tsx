// components/OrderCard.tsx
type Props = {
  label: string;
  onClick: () => void;
};

export default function OrderCard({ label, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="
        bg-emerald-400 text-white font-semibold
        rounded-lg shadow-md text-center
        px-4 py-3
        hover:bg-emerald-500 transition
      "
    >
      {label}
    </button>
  );
}
