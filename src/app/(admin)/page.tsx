import { Title } from "@/components/ui/title/Title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Package, TrendingUp, Clock } from "lucide-react";
import { getDashboardStats, getEventosHoy } from "@/actions";
import { extractTimeLocal } from "@/lib/date-util";

export default async function HomePage() {

  const { stats } = await getDashboardStats();
  const { eventos } = await getEventosHoy();

  if (!stats) {
    return <div>Error al cargar estadísticas</div>;
  }

  const estadisticas = [
    {
      title: "Total Inscritos",
      value: stats.totalInscritos,
      subtitle: "Inscripciones",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      title: "Pagos Validados",
      value: stats.pagosValidados,
      subtitle: `de ${stats.totalInscritos} inscritos`,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
    {
      title: "Kits Entregados",
      value: stats.kitsEntregados,
      subtitle: "Total entregados",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-950",
    },
    {
      title: "Asistencias Hoy",
      value: stats.asistenciasHoy,
      subtitle: "Registradas hoy",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-950",
    },
  ];

  return (
    <div className="space-y-6 mb-10">
      <Title title="Panel de Control" />

      {/* Estadísticas - 4 Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {estadisticas.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} ${stat.color} p-2 rounded-lg`}>
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="-mt-5">
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.subtitle}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Eventos de Hoy */}
      <div className="grid gap-4">
        <div>
          {eventos.length > 0 ? (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Eventos de Hoy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-border">
                  {eventos.map((evento) => {
                    const estadoConfig = {
                      en_curso: { 
                        label: "En curso", 
                        color: "text-green-600 dark:text-green-400",
                        bg: "bg-green-100 dark:bg-green-950",
                        borderColor: "border-l-4 border-green-500",
                      },
                      proximo: { 
                        label: "Próximo", 
                        color: "text-blue-600 dark:text-blue-400",
                        bg: "bg-blue-100 dark:bg-blue-950",
                        borderColor: "border-l-4 border-transparent",
                      },
                      finalizado: { 
                        label: "Finalizado", 
                        color: "text-gray-500 dark:text-gray-400",
                        bg: "bg-gray-100 dark:bg-gray-800",
                        borderColor: "border-l-4 border-transparent",
                      },
                    };

                    const config = estadoConfig[evento.estado];

                    return (
                      <div
                        key={evento.id_evento}
                        className={`flex items-start justify-between gap-4 py-3 pl-3 ${config.borderColor} transition-all hover:bg-muted/50`}
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base">{evento.denominacion}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                              {config.label}
                            </span>
                            {evento.descripcion && (
                              <span className="text-xs text-muted-foreground truncate">
                                {evento.descripcion}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground shrink-0">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="whitespace-nowrap">{extractTimeLocal(evento.hora_inicio)} - {extractTimeLocal(evento.hora_fin)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            <span className="whitespace-nowrap">{evento.totalAsistencias} asistencia{evento.totalAsistencias !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Eventos de Hoy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="bg-muted rounded-full p-4 mb-3">
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No hay eventos programados para hoy</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
