import { useState, useEffect } from "react";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/api/axios";
import { SegEncomiendas } from "./interfaces/segEncomiendas";
import { useNavigate } from "react-router-dom";
import { EstadoEncomienda } from "../encomiendaDetalles/enums/tipoEncomienda";

export enum TipoEncomienda {
  NORMAL = "NORMAL",
  FRAGIL = "FRAGIL",
  RIGIDO = "RIGIDO",
  PELIGROSO = "PELIGROSO",
  PERECEDERO = "PERECEDERO",
}

const columns: ColumnDef<SegEncomiendas>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "emisor_nombres",
    header: "Emisor",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("emisor_nombres")}</div>
    ),
  },
  {
    accessorKey: "num_doc_emisor",
    header: "DNI Emisor",
    cell: ({ row }) => <div>{row.getValue("num_doc_emisor")}</div>,
  },
  {
    accessorKey: "receptor_nombres",
    header: "Receptor",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("receptor_nombres")}</div>
    ),
  },
  {
    accessorKey: "num_doc_receptor",
    header: "DNI Receptor",
    cell: ({ row }) => <div>{row.getValue("num_doc_receptor")}</div>,
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => <div>{row.getValue("tipo")}</div>,
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => <div>{row.getValue("estado")}</div>,
  },
  {
    accessorKey: "fecha_hora_envio",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha de Envío
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const [fecha, hora] = new Date(row.getValue("fecha_hora_envio"))
        .toLocaleString()
        .split(",");

      return (
        <div className="text-center">
          <div>{fecha}</div>
          <div>{hora}</div>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const encomienda = row.original;
      const navigate = useNavigate();

      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DialogTrigger asChild>
                <DropdownMenuItem>Ver detalles</DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalles de la Encomienda</DialogTitle>
              <DialogDescription>
                Información detallada de la encomienda seleccionada.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="emisor" className="text-right">
                  Emisor
                </Label>
                <Input
                  id="emisor"
                  value={encomienda.emisor_nombres}
                  className="col-span-3"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="receptor" className="text-right">
                  Receptor
                </Label>
                <Input
                  id="receptor"
                  value={encomienda.receptor_nombres}
                  className="col-span-3"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tipo" className="text-right">
                  Tipo
                </Label>
                <Input
                  id="tipo"
                  value={encomienda.tipo}
                  className="col-span-3"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="estado" className="text-right">
                  Estado
                </Label>
                <Input
                  id="estado"
                  value={encomienda.estado}
                  className="col-span-3"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fecha" className="text-right">
                  Fecha de Envío
                </Label>
                <Input
                  id="fecha"
                  value={new Date(encomienda.fecha_hora_envio).toLocaleString()}
                  className="col-span-3"
                  readOnly
                />
              </div>
            </div>
            <div className="flex justify-center items-center ">
              <Button
                onClick={() => navigate(`/ecomienda-detalles/${encomienda.id}`)}
                className="hover:bg-teal-800"
              >
                Entregar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
];

const queryClient = new QueryClient();

export default function SeguimientoEcomiendaPageWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <SeguimientoEcomiendaPage />
    </QueryClientProvider>
  );
}

function SeguimientoEcomiendaPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [tipoFilter, setTipoFilter] = useState<TipoEncomienda | "ALL">("ALL");
  const [estadoFilter, setEstadoFilter] = useState<EstadoEncomienda | "All">(
    "All"
  );
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const {
    data: encomiendas,
    isLoading,
    isError,
  } = useQuery<SegEncomiendas[]>({
    queryKey: ["encomiendas"],
    queryFn: async () => {
      const res = await api.get("/encomienda");
      return res.data;
    },
  });

  const table = useReactTable({
    data: encomiendas || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  useEffect(() => {
    if (tipoFilter && tipoFilter !== "ALL") {
      table.getColumn("tipo")?.setFilterValue(tipoFilter);
    } else {
      table.getColumn("tipo")?.setFilterValue(undefined);
    }
  }, [tipoFilter, table]);

  useEffect(() => {
    if (estadoFilter && estadoFilter !== "All") {
      table.getColumn("estado")?.setFilterValue(estadoFilter);
    } else {
      table.getColumn("estado")?.setFilterValue(undefined);
    }
  }, [estadoFilter, table]);

  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      table.getColumn("fecha_hora_envio")?.setFilterValue((value: string) => {
        const date = new Date(value);
        return date >= dateRange.from! && date <= dateRange.to!;
      });
    } else {
      table.getColumn("fecha_hora_envio")?.setFilterValue(undefined);
    }
  }, [dateRange, table]);

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar los datos</div>;

  return (
    <div className="w-full">
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        <Input
          placeholder="Buscar por DNI..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className=""
        />

        {/* <div className="grid grid-cols-2 gap-3"> */}
        <Select
          onValueChange={(value) =>
            setTipoFilter(value as TipoEncomienda | "ALL")
          }
        >
          <SelectTrigger className=" ">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            {Object.values(TipoEncomienda).map((tipo) => (
              <SelectItem key={tipo} value={tipo}>
                {tipo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            setEstadoFilter(value as EstadoEncomienda | "All")
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por estado"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Todos</SelectItem>
            {Object.values(EstadoEncomienda).map((tipo) => (
              <SelectItem key={tipo} value={tipo}>
                {tipo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* </div> */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="">
              Filtrar por fecha
            </Button>
          </DialogTrigger>
          {/* <DialogContent className="sm:max-w-[425px]"> */}
          <DialogContent className="min-w-[650px]">
            <DialogHeader>
              <DialogTitle>Filtrar por fecha</DialogTitle>
              <DialogDescription>
                Seleccione un rango de fechas para filtrar las encomiendas.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                {/* <Label htmlFor="from" className="text-center">
                  Desde
                </Label> */}
                <Calendar
                  mode="single"
                  selected={dateRange.from}
                  onSelect={(date) =>
                    setDateRange((prev) => ({ ...prev, from: date }))
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                {/* <Label htmlFor="to" className="text-right">
                  Hasta
                </Label> */}
                <Calendar
                  mode="single"
                  selected={dateRange.to}
                  onSelect={(date) =>
                    setDateRange((prev) => ({ ...prev, to: date }))
                  }
                  className="col-span-3"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-end items-end my-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columnas <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
