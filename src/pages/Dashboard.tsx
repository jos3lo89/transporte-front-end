import api from "@/api/axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus, DollarSign, Package, Users } from "lucide-react";
import { useEffect, useState } from "react";

export interface AllDataI {
  gananciaTotalViaje: number;
  gananciaTotalEncomienda: number;
  cantidadDeViajes: number;
  cantidadEncomiendas: number;
  cantidadVehiculos: number;
  cantidadPersonal: number;
}

const Dashboard = () => {
  const [allData, setAllData] = useState<AllDataI | null>(null);

  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = async () => {
    try {
      const res = await api.get("/dashboard");
      console.log(res.data);
      setAllData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // const data = [
  //   {
  //     name: "Ene",
  //     total: Math.floor(Math.random() * 5000) + 1000,
  //   },
  //   {
  //     name: "Feb",
  //     total: Math.floor(Math.random() * 5000) + 1000,
  //   },
  //   {
  //     name: "Mar",
  //     total: Math.floor(Math.random() * 5000) + 1000,
  //   },
  //   {
  //     name: "Abr",
  //     total: Math.floor(Math.random() * 5000) + 1000,
  //   },
  //   {
  //     name: "May",
  //     total: Math.floor(Math.random() * 5000) + 1000,
  //   },
  //   {
  //     name: "Jun",
  //     total: Math.floor(Math.random() * 5000) + 1000,
  //   },
  // ];

  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            {/* <Button>Descargar</Button> */}
          </div>
        </div>

        {allData && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:bg-secondary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ingresos Totales Por Viajes
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  S/ {allData.gananciaTotalViaje}
                </div>
                {/* <p className="text-xs text-muted-foreground">
                +20.1% desde el mes pasado
              </p> */}
              </CardContent>
            </Card>

            <Card className="hover:bg-secondary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ingresos Totales por Encomiendas
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  S/ {allData.gananciaTotalEncomienda}
                </div>
                {/* <p className="text-xs text-muted-foreground">
                  +19% desde el mes pasado
                </p> */}
              </CardContent>
            </Card>

            <Card className="hover:bg-secondary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Cantidad de pasajeros
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {allData.cantidadDeViajes}
                </div>
                {/* <p className="text-xs text-muted-foreground">
                  +201 desde el mes pasado
                </p> */}
              </CardContent>
            </Card>
            <Card className="hover:bg-secondary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Cantidad de encomiendas
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {allData.cantidadEncomiendas}
                </div>
                {/* <p className="text-xs text-muted-foreground">
                  +201 desde el mes pasado
                </p> */}
              </CardContent>
            </Card>
            <Card className="hover:bg-secondary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Cantidad de empleados
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {allData.cantidadPersonal}
                </div>
                {/* <p className="text-xs text-muted-foreground">
                  +201 desde el mes pasado
                </p> */}
              </CardContent>
            </Card>
            <Card className="hover:bg-secondary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Cantidad de vehiculos
                </CardTitle>
                {/* <Activity className="h-4 w-4 text-muted-foreground" /> */}

                <Bus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {allData.cantidadVehiculos}
                </div>
                {/* <p className="text-xs text-muted-foreground">
                  +201 desde el mes pasado
                </p> */}
              </CardContent>
            </Card>
          </div>
        )}

        {/*
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Has tenido 265 ventas este mes.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Usuario</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "Ana", product: "Laptop Pro", amount: "$1,999.00" },
                    {
                      name: "Carlos",
                      product: "Smartphone X",
                      amount: "$799.00",
                    },
                    { name: "Elena", product: "Tablet Air", amount: "$499.00" },
                    { name: "David", product: "Smartwatch", amount: "$299.00" },
                    {
                      name: "Sofía",
                      product: "Auriculares BT",
                      amount: "$159.00",
                    },
                  ].map((sale) => (
                    <TableRow key={sale.name}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage
                              src={`/placeholder.svg?height=32&width=32`}
                              alt={sale.name}
                            />
                            <AvatarFallback>
                              {sale.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {sale.name}
                        </div>
                      </TableCell>
                      <TableCell>{sale.product}</TableCell>
                      <TableCell>{sale.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
 */}
      </div>
    </div>
  );
};
export default Dashboard;
