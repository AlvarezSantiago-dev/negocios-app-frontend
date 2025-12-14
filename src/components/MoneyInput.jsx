import { Input } from "@/components/ui/input";
import { formatMoney } from "@/services/money";

export default function MoneyInput({
  value,
  onChange,
  placeholder = "$ 0",
  disabled = false,
}) {
  const handleChange = (e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");
    onChange(onlyNumbers);
  };

  return (
    <Input
      type="text"
      inputMode="numeric"
      placeholder={placeholder}
      value={formatMoney(value)}
      onChange={handleChange}
      disabled={disabled}
    />
  );
}
