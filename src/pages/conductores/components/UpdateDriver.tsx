import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import axios from "@/api/axios";
import { toast } from "sonner";
import { ConductoresApi } from "@/interfaces/conductores";

const formSchemeState = z.object({
  state: z.string().min(1, { message: "Selecione un estado" }),
});
type FormSchemetype = z.infer<typeof formSchemeState>;

type Props = {
  driver: ConductoresApi;
  traerConductores: () => Promise<void>;
};

const UpdateDriver = ({ traerConductores, driver }: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [driverData] = useState<ConductoresApi>(driver);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemetype>({
    resolver: zodResolver(formSchemeState),
  });

  const onSubmit = async (values: FormSchemetype) => {
    console.log("valores del formulario", values);
    try {
      const res = await axios.put(
        `/conductores/change-state/${driverData.id}`,
        values
      );
      console.log(res);
      setOpenModal(false);
      toast.success("Estado actualizado.", {
        duration: 1500,
        richColors: true,
        closeButton: true,
        position: "top-center",
      });

      await traerConductores();
    } catch (error) {
      console.log(error);
      toast.warning("Error al actualizar el estado.", {
        duration: 1500,
        richColors: true,
        closeButton: true,
        position: "bottom-center",
      });
    }
  };

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex justify-center items-center flex-col space-y-6">
        <DialogHeader>
          <DialogTitle>Editar Vehículo</DialogTitle>
          <DialogDescription>
            Actualiza el estado de vehículo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div className="flex gap-4">
            <div className="mb-3">
              <Controller
                name="state"
                control={control}
                defaultValue={driverData.estado}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="ACTIVO">Activo</SelectItem>
                        <SelectItem value="INACTIVO">Inactivo</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.state && (
                <span className="mt-1 mb-4 text-red-600 font-light">
                  {errors.state.message}
                </span>
              )}
              {errors.root && (
                <span className="mt-1 mb-4 text-red-600 font-light">
                  {errors.root.message}
                </span>
              )}
            </div>
            <div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Actualizando.." : "Actualizar"}
              </Button>
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => setOpenModal(false)}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default UpdateDriver;
