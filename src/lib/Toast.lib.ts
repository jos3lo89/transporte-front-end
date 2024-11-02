import { toast } from "sonner";

type Message = string | string[];
type Tipo = "success" | "warning" | "error" | "info";
type Posicion =
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";

export const myToast = (
  message: Message,
  tipo: Tipo,
  position: Posicion,
  duration: number = 1500
) => {
  const messages = Array.isArray(message) ? message : [message];

  const config = {
    duration: duration,
    position: position,
    richColors: true,
    dismissible: true,
    action: {
      label: "Cerrar",
      onClick: () => {
        toast.dismiss();
      },
    },
  };

  switch (tipo) {
    case "success":
      return messages.forEach((msg) => {
        toast.success(msg, config);
      });
    case "warning":
      return messages.forEach((msg) => {
        toast.warning(msg, config);
      });
    case "error":
      return messages.forEach((msg) => {
        toast.error(msg, config);
      });
    case "info":
      return messages.forEach((msg) => {
        toast.info(msg, config);
      });
    default:
      return messages.forEach((msg) => {
        toast(msg, config);
      });
  }
};
