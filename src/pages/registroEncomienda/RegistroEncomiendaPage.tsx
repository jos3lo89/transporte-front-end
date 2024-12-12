import { useEffect, useState } from "react";
import autoTable from "jspdf-autotable";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import api from "@/api/axios";
import {
  encomiendaSchema,
  EncomiendaFormData,
} from "./schemas/encomiendaSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import { traerUsuario } from "@/utils/api-reniec";
import { Textarea } from "@/components/ui/textarea";
import { jsPDF } from "jspdf";
export interface TerminalesApi {
  id: string;
  ciudad: string;
  createdAt: string;
  updatedAt: string;
}

export interface PdfData {
  origen: string;
  destino: string;
  remitente: string;
  consignado: string;
  direccion_consigando: string;
  n: number;
  descripcion: string;
  peso: number;
  importe: number;
  importe_total: number;
}

const RegistroEncomiendaPage = () => {
  const [terminales, setTerminales] = useState<TerminalesApi[] | null>(null);

  const form = useForm<EncomiendaFormData>({
    resolver: zodResolver(encomiendaSchema),
    defaultValues: {
      emisor_nombres: "",
      num_doc_emisor: "",
      num_telefono_emisor: "",
      receptor_nombres: "",
      num_doc_receptor: "",
      num_telefono_receptor: "",
      descripcion: "",
      tipo: "NORMAL",
      codigo_recogida: "",
      peso_kilos: 0,
      precio_total: 0,
      terminal_origen_id: "",
      terminal_destino_id: "",
    },
  });

  const getTerminales = async () => {
    try {
      const res = await api.get("/terminales");
      setTerminales(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Error al cargar las terminales");
    }
  };

  useEffect(() => {
    getTerminales();
  }, []);

  const getEmisor = async () => {
    try {
      const res = await traerUsuario(form.getValues("num_doc_emisor"));
      form.setValue("emisor_nombres", res.data.nombre);
    } catch (error) {
      console.log(error);
    }
  };

  const getReceptor = async () => {
    try {
      const res = await traerUsuario(form.getValues("num_doc_receptor"));
      form.setValue("receptor_nombres", res.data.nombre);
    } catch (error) {
      console.log(error);
    }
  };
  const onSubmit = async (data: EncomiendaFormData) => {
    try {
      await api.post("/encomienda", {
        emisor_nombres: data.emisor_nombres,
        num_doc_emisor: data.num_doc_emisor,
        num_telefono_emisor: data.num_telefono_emisor,
        receptor_nombres: data.receptor_nombres,
        num_doc_receptor: data.num_doc_receptor,
        num_telefono_receptor: data.num_telefono_receptor,
        descripcion: data.descripcion,
        tipo: data.tipo,
        codigo_recogida: data.codigo_recogida,
        peso_kilos: data.peso_kilos,
        precio_total: data.precio_total,
        terminal_origen_id: data.terminal_origen_id,
        terminal_destino_id: data.terminal_destino_id,
      });

      toast.success("Encomienda registrada con éxito", {
        richColors: true,
        position: "top-center",
        duration: 1500,
        cancel: true,
      });

      createPdf({
        origen: terminales?.find(
          (t: TerminalesApi) => t.id === data.terminal_origen_id
        )?.ciudad,
        destino: terminales?.find(
          (t: TerminalesApi) => t.id === data.terminal_destino_id
        )?.ciudad,
        remitente: data.emisor_nombres,
        consignado: data.receptor_nombres,
        direccion_consigando: "",
        n: 1,
        descripcion: data.descripcion,
        peso: data.peso_kilos,
        importe: data.precio_total,
        importe_total: data.precio_total,
      });

      form.reset({
        terminal_origen_id: terminales?.find((t) => t.ciudad === "Andahuaylas")
          ?.id,
        terminal_destino_id: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const createPdf = async (data: any) => {
    console.log("pdf data -> ", data);

    const doc = new jsPDF();

    const logoBase64 = await cargarImagenBase64("logo-transporte.png");

    doc.addImage(logoBase64, "PNG", 15, 10, 40, 30);

    // Encabezado con los datos de la empresa
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold"); // Cambia a fuente Helvetica en negrita
    doc.text("ENPRESA DE TRANSPORTE EL APURIMEÑO", 105, 23, {
      align: "center",
    });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal"); // Cambia a fuente Helvetica en negrita
    doc.text("AV. AYACUCHO NRO 874 - SALINAS - ANDAHUAYLAS", 105, 28, {
      align: "center",
    });
    doc.setFont("helvetica", "bold"); // Cambia a fuente Helvetica en negrita
    doc.text("Teléfono: 927371429 - 986561635", 105, 34, { align: "center" });
    doc.text("E-mail: flor_gml@hotmail.com", 105, 40, { align: "center" });

    // Línea separadora
    doc.line(10, 45, 200, 45);
    doc.setFont("helvetica", "normal");
    // Información del cliente y evento
    doc.setFontSize(10);
    doc.line(155, 18, 155, 38);
    doc.line(190, 18, 190, 38);
    doc.line(155, 18, 190, 18);
    doc.line(155, 38, 190, 38);

    doc.setFont("helvetica", "bold");
    doc.text("N° 33", 157, 25);
    doc.text(`C001-${Math.floor(Math.random() * (99 - 1 + 1)) + 1}`, 157, 30);
    doc.text("ruc:  10453980621", 157, 35);

    doc.setFont("helvetica", "normal");
    const fechaActual = new Date().toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    autoTable(doc, {
      startY: 48,
      head: [["Origen", "Fecha", "Destino"]],
      body: [[`${data.origen}`, `${fechaActual}`, `${data.destino}`]],
      headStyles: {
        fillColor: [255, 255, 255], // Color de fondo blanco (sin color)
        textColor: [0, 0, 0], // Color del texto negro
        fontStyle: "bold", // Estilo de fuente en negrita
      },
      bodyStyles: {
        textColor: [0, 0, 0], // Color del texto negro
      },
      theme: "grid",
    });

    doc.line(10, 69, 200, 69);
    doc.setFont("helvetica", "bold");
    doc.text(`REMITENTE:`, 10, 80);
    doc.setFont("helvetica", "normal");
    doc.text(`${data.remitente}`, 15, 85);

    doc.setFont("helvetica", "bold");
    doc.text(`CONSIGNADO:`, 10, 92);
    doc.setFont("helvetica", "normal");
    doc.text(`${data.consignado}`, 15, 97);

    doc.line(10, 105, 200, 105);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);

    doc.text("ECOMINEDAS      CARTAS    GIROS-CARGA", 105, 115, {
      align: "center",
    });

    doc.line(10, 120, 200, 120);

    autoTable(doc, {
      startY: 125,
      head: [["N°", "DESCRIPCION", "PESO", "IMPORTE"]],
      body: [
        ["1", `${data.descripcion}`, `${data.peso} KG`, `S/${data.importe}`],
      ],
      headStyles: {
        fillColor: [255, 255, 255], // Color de fondo blanco (sin color)
        textColor: [0, 0, 0], // Color del texto negro
        fontStyle: "bold", // Estilo de fuente en negrita
      },
      bodyStyles: {
        textColor: [0, 0, 0], // Color del texto negro
      },
      theme: "plain",
    });

    doc.line(10, 180, 200, 180);
    doc.setFontSize(12);
    doc.text(`TOTAL: S/. ${data.importe_total}`, 150, 185);

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

  const cargarImagenBase64 = async (ruta: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = ruta;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = (error) => reject(error);
    });
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Registro de Encomienda</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="border rounded-lg shadow-lg">
            <div className="text-center bg-secondary p-1 rounded-lg my-2 mx-4">
              <p className="font-semibold capitalize">Datos del emisor</p>
            </div>
            <div className="grid grid-cols-2 p-6 gap-3">
              <FormField
                control={form.control}
                name="num_doc_emisor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documento del Emisor</FormLabel>
                    <FormControl>
                      <Input placeholder="Documento del Emisor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-7 ml-3">
                <Button type="button" onClick={getEmisor}>
                  <SearchIcon />
                </Button>
              </div>
              <FormField
                control={form.control}
                name="emisor_nombres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Emisor</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del Emisor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="num_telefono_emisor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono del Emisor</FormLabel>
                    <FormControl>
                      <Input placeholder="Teléfono del Emisor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="border p-6 rounded-lg shadow-lg">
            <div className="text-center   bg-secondary p-1 rounded-lg mb-2">
              <p className="font-semibold capitalize">datos del receptor</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="num_doc_receptor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documento del Receptor</FormLabel>
                    <FormControl>
                      <Input placeholder="Documento del Receptor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-7 ml-3">
                <Button type="button" onClick={getReceptor}>
                  <SearchIcon />
                </Button>
              </div>
              <FormField
                control={form.control}
                name="receptor_nombres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Receptor</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del Receptor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="num_telefono_receptor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono del Receptor</FormLabel>
                    <FormControl>
                      <Input placeholder="Teléfono del Receptor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="border p-6 rounded-lg shadow-lg">
            <div className="text-center bg-secondary p-1 rounded-lg mb-2 ">
              <p>Datos de la encomienda</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descripción de la encomienda"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NORMAL">NORMAL</SelectItem>
                        <SelectItem value="FRAGIL">FRÁGIL</SelectItem>
                        <SelectItem value="RIGIDO">RIGIDO</SelectItem>
                        <SelectItem value="PELIGROSO">PELIGROSO</SelectItem>
                        <SelectItem value="PERECEDERO">PERECEDERO</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="codigo_recogida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de Recogida</FormLabel>
                    <FormControl>
                      <Input placeholder="Código de Recogida" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="peso_kilos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Peso en kilos"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (isNaN(value)) {
                            field.onChange("");
                          } else {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="border p-6 rounded-lg shadow-lg">
            <div className="text-center p-1 bg-secondary rounded-lg mb-2 ">
              <p className="font-semibold capitalize">Detalles del destino</p>
            </div>
            <div className="grid grid-cols-2  gap-3">
              <FormField
                control={form.control}
                name="terminal_origen_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Terminal de origen</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione terminal de destino" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {terminales &&
                          terminales
                            .filter((t) => t.ciudad == "Andahuaylas")
                            .map((terminal) => (
                              <SelectItem key={terminal.id} value={terminal.id}>
                                {terminal.ciudad}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="terminal_destino_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Terminal de Destino</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione terminal de destino" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {terminales &&
                          terminales
                            .filter((t) => t.ciudad !== "Andahuaylas")
                            .map((terminal) => (
                              <SelectItem key={terminal.id} value={terminal.id}>
                                {terminal.ciudad}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 p-6 gap-3">
            <FormField
              control={form.control}
              name="precio_total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio Total</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Precio total"
                      {...field}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (isNaN(value)) {
                          field.onChange("");
                        } else {
                          field.onChange(value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-center items-center">
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting
                ? "Registrando..."
                : "Registrar Encomienda"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegistroEncomiendaPage;
