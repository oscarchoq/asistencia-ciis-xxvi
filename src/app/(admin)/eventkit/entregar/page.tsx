import { Title } from "@/components/ui/title/Title";
import EntregarKitForm from "./ui/EntregarKitForm";

export default function EntregarKitPage() {
  return (
    <div className="space-y-6">
      <Title title="Entregar Kit" />
      <EntregarKitForm />
    </div>
  );
}
