import { Title } from "@/components/ui/title/Title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { Users, UserCheck, Calendar, Package } from "lucide-react";

export default async function HomePage() {
  // Obtener estadísticas del sistema
  const [
    totalInscripciones,
    inscripcionesValidadas,
    totalEventos,
    eventosActivos,
    totalAsistencias,
    totalKitsEntregados,
  ] = await Promise.all([
    prisma.inscripcion.count(),
    prisma.inscripcion.count({ where: { pago_validado: true } }),
    prisma.evento.count(),
    prisma.evento.count({ where: { activo: true } }),
    prisma.asistencia.count(),
    prisma.kit.count({ where: { entregado: true } }),
  ]);

  // Obtener eventos de hoy
  const hoy = new Date();
  const fechaHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

  const eventosHoy = await prisma.evento.findMany({
    where: {
      activo: true,
      fecha_evento: fechaHoy,
    },
    orderBy: {
      hora_inicio: "asc",
    },
  });

  const estadisticas = [
    {
      title: "Inscripciones",
      value: totalInscripciones,
      subtitle: `${inscripcionesValidadas} validadas`,
      icon: Users,
    },
    {
      title: "Asistencias",
      value: totalAsistencias,
      subtitle: "Registradas",
      icon: UserCheck,
    },
    {
      title: "Eventos",
      value: totalEventos,
      subtitle: `${eventosActivos} activos`,
      icon: Calendar,
    },
    {
      title: "Kits",
      value: totalKitsEntregados,
      subtitle: "Entregados",
      icon: Package,
    },
  ];

  return (
    <div className="space-y-6">
      <Title title="Panel de Control" />

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {estadisticas.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
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
      {eventosHoy.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Eventos de Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {eventosHoy.map((evento) => {
                const horaInicio = new Date(evento.hora_inicio);
                const horaFin = new Date(evento.hora_fin);
                const ahora = new Date();
                const horaActual = ahora.getHours() * 60 + ahora.getMinutes();
                const inicioMinutos =
                  horaInicio.getHours() * 60 + horaInicio.getMinutes();
                const finMinutos =
                  horaFin.getHours() * 60 + horaFin.getMinutes();

                const enCurso =
                  horaActual >= inicioMinutos && horaActual <= finMinutos;

                return (
                  <div
                    key={evento.id_evento}
                    className="flex items-center justify-between border-l-2 pl-4 py-2"
                    style={{
                      borderColor: enCurso ? "hsl(var(--primary))" : "transparent",
                    }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{evento.denominacion}</h4>
                        {enCurso && (
                          <span className="text-xs font-medium text-primary">
                            • En curso
                          </span>
                        )}
                      </div>
                      {evento.descripcion && (
                        <p className="text-sm text-muted-foreground">
                          {evento.descripcion}
                        </p>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {horaInicio.toLocaleTimeString("es-PE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {horaFin.toLocaleTimeString("es-PE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
