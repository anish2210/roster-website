// components/layout/PageHeader.jsx
import Button from "../ui/Button";

export default function PageHeader({ title, subtitle, actionLabel }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>

      <Button>{actionLabel}</Button>
    </div>
  );
}
