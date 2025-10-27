import { Title } from "@/components/ui/title/Title";
import EntregarKitForm from "./ui/EntregarKitForm";
import { checkModuleAccess } from "@/lib/auth-utils";

export default async function EntregarKitPage() {
  // Validar acceso al módulo
  await checkModuleAccess('eventkit');
  
  return (
    <div className="space-y-6">
      <Title title="Entregar Kit" />
      <EntregarKitForm />
    </div>
  );
}
