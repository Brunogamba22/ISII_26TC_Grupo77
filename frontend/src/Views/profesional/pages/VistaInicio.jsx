
import { apiRequest } from "../../../apiClient";
import { useState, useEffect } from "react";

import {
  CalendarDays,
  RefreshCw,
  Clock3,
  ShieldCheck,
  ArrowRight
} from "lucide-react";

export default function VistaInicio({
  setVistaActiva,
}) {

  const nombre =
    localStorage.getItem("nombre") ||
    "Profesional";
  
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <section
        className="
          bg-gradient-to-r
          from-cyan-600
          to-cyan-500
          rounded-3xl
          p-8
          text-white
          shadow-xl
        "
      >

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <h1 className="text-4xl font-bold">
              Bienvenido, {nombre}
            </h1>

            <p className="mt-3 text-cyan-100 text-lg">
              Sistema inteligente de gestión
              de guardias médicas y reemplazos.
            </p>

          </div>

          

        </div>

      </section>

      {/* TARJETAS */}
      <section
        className="
          grid grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
        "
      >

        {/* Guardias */}
        <div
          className="
            bg-white
            rounded-3xl
            p-6
            border border-slate-200
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                Guardias Asignadas
              </p>

              <h2 className="text-4xl font-bold text-slate-800 mt-2">
                3
              </h2>

            </div>

            <div
              className="
                w-14 h-14
                rounded-2xl
                bg-cyan-100
                flex items-center justify-center
              "
            >
              <CalendarDays
                className="text-cyan-700"
                size={28}
              />
            </div>

          </div>

        </div>

        {/* Pendientes */}
        <div
          className="
            bg-white
            rounded-3xl
            p-6
            border border-slate-200
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                Solicitudes Pendientes
              </p>

              <h2 className="text-4xl font-bold text-slate-800 mt-2">
                1
              </h2>

            </div>

            <div
              className="
                w-14 h-14
                rounded-2xl
                bg-orange-100
                flex items-center justify-center
              "
            >
              <RefreshCw
                className="text-orange-600"
                size={28}
              />
            </div>

          </div>

        </div>

        {/* Próxima guardia */}
        <div
          className="
            bg-white
            rounded-3xl
            p-6
            border border-slate-200
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                Próxima Guardia
              </p>

              <h2 className="text-2xl font-bold text-slate-800 mt-2">
                10 Jun
              </h2>

              <p className="text-slate-500 mt-1">
                08:00 hs
              </p>

            </div>

            <div
              className="
                w-14 h-14
                rounded-2xl
                bg-violet-100
                flex items-center justify-center
              "
            >
              <Clock3
                className="text-violet-700"
                size={28}
              />
            </div>

          </div>

        </div>

        {/* Estado */}
        <div
          className="
            bg-white
            rounded-3xl
            p-6
            border border-slate-200
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                Estado del Sistema
              </p>

              <h2 className="text-xl font-bold text-emerald-600 mt-2">
                Operativo
              </h2>

            </div>

            <div
              className="
                w-14 h-14
                rounded-2xl
                bg-emerald-100
                flex items-center justify-center
              "
            >
              <ShieldCheck
                className="text-emerald-700"
                size={28}
              />
            </div>

          </div>

        </div>

      </section>

      {/* PANEL INFORMATIVO */}
      <section
        className="
          bg-white
          rounded-3xl
          border border-slate-200
          p-8
          shadow-sm
        "
      >

        <h2 className="text-2xl font-bold text-slate-800">
          Seguimiento de Guardias y Reemplazos
        </h2>

        <p className="text-slate-500 mt-4 leading-relaxed">
          Desde este módulo podrá consultar
          sus guardias asignadas, realizar
          solicitudes de reemplazo y hacer
          seguimiento del estado de cada
          solicitud registrada dentro del
          sistema MediGuard Pro.
        </p>

        <div className="mt-8">

          <button
            onClick={() =>
              setVistaActiva("guardias")
            }
            className="
              bg-cyan-600
              hover:bg-cyan-700
              text-white
              px-6 py-4
              rounded-2xl
              font-semibold
              transition-all duration-200
            "
          >
            Consultar Guardias Asignadas
          </button>

        </div>

      </section>

    </div>
  );
}