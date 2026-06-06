import { useState } from "react";
import { apiRequest } from "../../../apiClient";

const SolicitudCambio = ({
  usuario,
  guardiaSeleccionada,
  onCancelar,
}) => {
  const [motivo, setMotivo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setEnviando(true);

      const { response, data } =
        await apiRequest("/solicitudes", {
          method: "POST",
          body: {
            motivo,
            id_guardia:
              guardiaSeleccionada.id_guardia,
            id_usuario: usuario.id_usuario,
          },
        });

      if (!response.ok) {
        setMensaje(
          data?.error ||
            "No se pudo enviar la solicitud"
        );
        return;
      }

      setMensaje(
        "Solicitud enviada correctamente"
      );

      setMotivo("");
    } catch (error) {
      setMensaje("Error del servidor");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="space-y-6">

      <header>
        <h1 className="text-4xl font-bold text-slate-800">
          Solicitud de Cambio
        </h1>
      </header>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">

        <div className="mb-6">
          <h2 className="text-xl font-bold text-cyan-700">
            Guardia Seleccionada
          </h2>

          <p className="mt-2 text-slate-600">
            Guardia #
            {guardiaSeleccionada.id_guardia}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>
            <label className="block mb-2 font-semibold">
              Motivo
            </label>

            <textarea
              value={motivo}
              onChange={(e) =>
                setMotivo(e.target.value)
              }
              className="
                w-full border rounded-2xl
                p-4 outline-none
                focus:ring-2 focus:ring-cyan-500
              "
              rows="5"
            />
          </div>

          {mensaje && (
            <div className="bg-slate-100 rounded-xl p-4">
              {mensaje}
            </div>
          )}

          <div className="flex gap-4">

            <button
              type="button"
              onClick={onCancelar}
              className="
                px-6 py-3 rounded-2xl
                bg-slate-200
              "
            >
              Volver
            </button>

            <button
              type="submit"
              disabled={enviando}
              className="
                px-6 py-3 rounded-2xl
                bg-cyan-600 text-white
              "
            >
              {enviando
                ? "Enviando..."
                : "Enviar Solicitud"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default SolicitudCambio;