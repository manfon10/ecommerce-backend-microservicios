import Link from "next/link";

interface Props {
  label: string;
  href: string;
  color: string;
  value: number | string;
}

export const StatisticCard = ({ color, href, label, value }: Props) => {
  return (
    <>
      <Link
        key={label}
        href={href}
        className="bg-white rounded-2xl border border-zinc-100 p-5 hover:shadow-md transition-shadow"
      >
        <p className="text-xs text-zinc-400 mb-2">{label}</p>
        <p className={`text-2xl font-bold px-2 py-0.5 rounded-lg inline-block ${color}`}>{value}</p>
      </Link>
    </>
  );
};
