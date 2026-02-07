type Props = {
  type?: string | null;
};

export default function ChurchTypeTag({ type }: Props) {
  if (!type) return null;

  const isHQ = type.toLowerCase() === "headquarter";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
        ${
          isHQ
            ? "bg-blue-100 text-blue-700"
            : "bg-green-100 text-green-700"
        }`}
    >
      {isHQ ? "Headquarter" : "Circuit"}
    </span>
  );
}
