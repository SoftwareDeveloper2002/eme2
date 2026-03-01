interface CardProps {
  title: string;
  children: React.ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h3 className="font-semibold">{title}</h3>
      <div className="text-gray-600 mt-2">{children}</div>
    </div>
  );
}