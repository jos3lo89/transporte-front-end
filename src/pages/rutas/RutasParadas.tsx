import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ArrowUpDown } from "lucide-react";
import axios from "@/api/axios";

interface Ruta {
  id: string;
  duracion: number;
  distancia_km: string;
  origen: { ciudad: string };
  destino: { ciudad: string };
  createdAt: string;
}

const RutasParadas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Ruta;
    direction: "asc" | "desc";
  } | null>(null);

  const [rutas, setRutas] = useState<Ruta[]>([]);

  useEffect(() => {
    traerRutas();
  }, []);

  const traerRutas = async () => {
    try {
      const res = await axios.get("/rutas");
      console.log(res);

      setRutas(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSort = (key: keyof Ruta) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig?.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const sortedRutas = [...rutas].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
    if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredRutas = sortedRutas.filter(
    (ruta) =>
      ruta.origen.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ruta.destino.ciudad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Rutas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Search className="w-5 h-5 text-gray-500" />
          <Input
            placeholder="Buscar por origen o destino..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  onClick={() => handleSort("origen")}
                  className="cursor-pointer"
                >
                  Origen <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead
                  onClick={() => handleSort("destino")}
                  className="cursor-pointer"
                >
                  Destino <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead
                  onClick={() => handleSort("duracion")}
                  className="cursor-pointer"
                >
                  Duración (min) <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead
                  onClick={() => handleSort("distancia_km")}
                  className="cursor-pointer"
                >
                  Distancia (km) <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRutas.map((ruta) => (
                <TableRow key={ruta.id}>
                  <TableCell>{ruta.origen.ciudad}</TableCell>
                  <TableCell>{ruta.destino.ciudad}</TableCell>
                  <TableCell>{ruta.duracion}</TableCell>
                  <TableCell>{ruta.distancia_km}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
export default RutasParadas;
