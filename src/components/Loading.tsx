import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="w-full min-h-full mt-10 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Cargando...</p>
      </div>
    </div>
  );
};
export default Loading;
