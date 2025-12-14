'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'inicio' | 'verificador' | 'derechos' | 'proceso' | 'contacto';

// Sueldo minimo 2024
const SUELDO_MINIMO = 500000;

function VerificadorRequisitos() {
  const [situacion, setSituacion] = useState<string>('');
  const [ingresos, setIngresos] = useState<string>('');
  const [tieneAbogado, setTieneAbogado] = useState<string>('');
  const [tipoCausa, setTipoCausa] = useState<string>('');
  const [resultado, setResultado] = useState<{
    califica: boolean;
    motivo: string;
    recomendaciones: string[];
    pasosSiguientes: string[];
  } | null>(null);

  const verificarRequisitos = () => {
    if (!situacion || !ingresos || !tieneAbogado) return;

    const ingresosNum = parseInt(ingresos) || 0;
    let califica = false;
    let motivo = '';
    const recomendaciones: string[] = [];
    const pasosSiguientes: string[] = [];

    // Verificar si esta en situacion que requiere defensa penal
    if (situacion === 'no-imputado') {
      califica = false;
      motivo = 'La Defensoria Penal Publica solo atiende a personas imputadas o investigadas por delitos.';
      recomendaciones.push('Si necesita asesoria legal en otras materias, consulte en la CAJ.');
      recomendaciones.push('Si cree que sera investigado, puede consultar preventivamente.');
    } else {
      // Verificar si ya tiene abogado particular
      if (tieneAbogado === 'si') {
        califica = false;
        motivo = 'Ya cuenta con defensa particular. La DPP atiende a quienes no pueden costear un abogado.';
        recomendaciones.push('Si desea cambiar a defensor publico, debe renunciar a su abogado particular.');
        recomendaciones.push('La renuncia debe comunicarse al tribunal.');
      } else {
        // Verificar ingresos
        if (ingresosNum <= SUELDO_MINIMO * 3) {
          califica = true;
          motivo = 'Cumple con los requisitos para acceder a la Defensoria Penal Publica.';
          pasosSiguientes.push('Acuda a la oficina de la DPP mas cercana con su cedula de identidad.');
          pasosSiguientes.push('Lleve cualquier documento relacionado con su causa (citaciones, notificaciones).');
          pasosSiguientes.push('Se le asignara un defensor publico sin costo.');
        } else if (ingresosNum <= SUELDO_MINIMO * 5) {
          califica = true;
          motivo = 'Puede acceder a la DPP, pero podria requerirse copago segun evaluacion.';
          recomendaciones.push('La DPP evaluara su situacion economica detalladamente.');
          recomendaciones.push('Puede solicitarse un aporte parcial al costo de la defensa.');
          pasosSiguientes.push('Acuda a la DPP con documentos que acrediten sus ingresos.');
        } else {
          califica = false;
          motivo = 'Sus ingresos superan el limite para defensa gratuita. Sin embargo, tiene derecho a defensor si no puede costear uno.';
          recomendaciones.push('La defensa penal es un derecho constitucional.');
          recomendaciones.push('Si demuestra que no puede pagar, igual puede acceder a la DPP.');
          recomendaciones.push('Acuda a la DPP y solicite evaluacion de su caso.');
          pasosSiguientes.push('Presente antecedentes de sus gastos fijos y cargas familiares.');
        }
      }
    }

    // Agregar informacion segun tipo de causa
    if (tipoCausa === 'flagrancia') {
      pasosSiguientes.unshift('En caso de detencion, tiene derecho a llamar a un abogado o a la DPP inmediatamente.');
      pasosSiguientes.push('El defensor debe estar presente en el control de detencion (24 hrs max).');
    } else if (tipoCausa === 'citacion') {
      pasosSiguientes.push('Tiene tiempo para preparar su defensa antes de la audiencia.');
      pasosSiguientes.push('Contacte a la DPP apenas reciba la citacion.');
    }

    setResultado({
      califica,
      motivo,
      recomendaciones,
      pasosSiguientes,
    });
  };

  const formatCLP = (value: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700"
    >
      <h2 className="text-2xl font-bold text-indigo-400 mb-6 flex items-center gap-2">
        <span>✅</span> Verificador de Requisitos DPP
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Situacion Actual</label>
            <select
              value={situacion}
              onChange={(e) => setSituacion(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Seleccione su situacion</option>
              <option value="detenido">Estoy detenido/a</option>
              <option value="formalizado">Estoy formalizado/a</option>
              <option value="citado">Fui citado/a a declarar</option>
              <option value="investigado">Estoy siendo investigado/a</option>
              <option value="no-imputado">No tengo causa penal</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Ingresos Mensuales del Hogar</label>
            <select
              value={ingresos}
              onChange={(e) => setIngresos(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Seleccione rango de ingresos</option>
              <option value="0">Sin ingresos</option>
              <option value="500000">Hasta {formatCLP(SUELDO_MINIMO)} (1 sueldo minimo)</option>
              <option value="1000000">Hasta {formatCLP(SUELDO_MINIMO * 2)} (2 sueldos minimos)</option>
              <option value="1500000">Hasta {formatCLP(SUELDO_MINIMO * 3)} (3 sueldos minimos)</option>
              <option value="2000000">Hasta {formatCLP(SUELDO_MINIMO * 4)} (4 sueldos minimos)</option>
              <option value="2500000">Hasta {formatCLP(SUELDO_MINIMO * 5)} (5 sueldos minimos)</option>
              <option value="3000000">Mas de {formatCLP(SUELDO_MINIMO * 5)}</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">¿Tiene abogado particular?</label>
            <select
              value={tieneAbogado}
              onChange={(e) => setTieneAbogado(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Seleccione</option>
              <option value="no">No tengo abogado</option>
              <option value="si">Si, tengo abogado particular</option>
              <option value="renuncio">Tuve pero renuncio/lo despedi</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Tipo de Causa (opcional)</label>
            <select
              value={tipoCausa}
              onChange={(e) => setTipoCausa(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Seleccione</option>
              <option value="flagrancia">Detencion en flagrancia</option>
              <option value="citacion">Citacion a audiencia</option>
              <option value="orden">Orden de detencion</option>
              <option value="investigacion">Investigacion en curso</option>
            </select>
          </div>

          <button
            onClick={verificarRequisitos}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Verificar Requisitos
          </button>
        </div>

        <div className="space-y-4">
          {resultado && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 rounded-lg p-6 space-y-4"
            >
              <div className={`p-4 rounded-lg ${resultado.califica ? 'bg-green-900/30 border border-green-700' : 'bg-yellow-900/30 border border-yellow-700'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{resultado.califica ? '✅' : '⚠️'}</span>
                  <h3 className={`text-lg font-semibold ${resultado.califica ? 'text-green-400' : 'text-yellow-400'}`}>
                    {resultado.califica ? 'Califica para DPP' : 'Verificar Situacion'}
                  </h3>
                </div>
                <p className="text-gray-300 text-sm">{resultado.motivo}</p>
              </div>

              {resultado.recomendaciones.length > 0 && (
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-indigo-400 font-semibold mb-2">Recomendaciones</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    {resultado.recomendaciones.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-indigo-400">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {resultado.pasosSiguientes.length > 0 && (
                <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                  <h4 className="text-blue-400 font-semibold mb-2">Pasos a Seguir</h4>
                  <ol className="text-gray-300 text-sm space-y-2">
                    {resultado.pasosSiguientes.map((p, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </motion.div>
          )}

          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
            <h4 className="text-red-400 font-semibold mb-2">Emergencia: Detencion</h4>
            <p className="text-gray-300 text-sm mb-2">
              Si esta detenido o un familiar fue detenido, tiene derecho a defensor INMEDIATAMENTE.
            </p>
            <p className="text-white font-bold text-lg">Fono DPP: 600 440 0800</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function InicioView() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-xl p-8 border border-indigo-700"
      >
        <h1 className="text-3xl font-bold text-indigo-400 mb-4">Defensoria Penal Publica</h1>
        <p className="text-gray-300 text-lg">
          Defensa penal gratuita garantizada por el Estado para todas las personas imputadas de un delito
          que no puedan costear un abogado particular.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: '⚖️', title: 'Defensa Gratuita', desc: 'Abogado defensor sin costo para imputados' },
          { icon: '🏛️', title: 'Derecho Constitucional', desc: 'Garantizado en la Constitucion (Art. 19 N°3)' },
          { icon: '⏰', title: 'Disponible 24/7', desc: 'Asistencia inmediata en detenciones' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <span className="text-4xl">{item.icon}</span>
            <h3 className="text-xl font-semibold text-white mt-4">{item.title}</h3>
            <p className="text-gray-400 mt-2">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-indigo-400 mb-4">¿Quien puede acceder a la DPP?</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            'Personas imputadas de cualquier delito',
            'Quienes no pueden costear abogado particular',
            'Detenidos en flagrancia o por orden judicial',
            'Citados a declarar como imputados',
            'Adolescentes infractores de ley',
            'Personas en prision preventiva',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-300">
              <span className="text-green-500">✓</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-red-900/30 border border-red-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-red-400 mb-2">Linea de Emergencia 24 Horas</h2>
        <p className="text-4xl font-bold text-white">600 440 0800</p>
        <p className="text-gray-300 mt-2">Disponible las 24 horas del dia, los 7 dias de la semana.</p>
      </div>
    </div>
  );
}

function DerechosView() {
  const derechos = [
    {
      titulo: 'Derecho a guardar silencio',
      descripcion: 'No esta obligado a declarar contra si mismo. Puede negarse a responder.',
      icono: '🤐',
    },
    {
      titulo: 'Derecho a conocer los cargos',
      descripcion: 'Debe ser informado de los hechos que se le imputan y los delitos.',
      icono: '📋',
    },
    {
      titulo: 'Derecho a defensa letrada',
      descripcion: 'Tiene derecho a un abogado desde la primera actuacion del procedimiento.',
      icono: '⚖️',
    },
    {
      titulo: 'Presuncion de inocencia',
      descripcion: 'Es inocente hasta que se demuestre lo contrario en juicio.',
      icono: '👤',
    },
    {
      titulo: 'Derecho a comunicarse',
      descripcion: 'Puede llamar a un familiar o abogado al ser detenido.',
      icono: '📞',
    },
    {
      titulo: 'Derecho a interprete',
      descripcion: 'Si no habla español, tiene derecho a un interprete gratuito.',
      icono: '🗣️',
    },
    {
      titulo: 'Control de detencion',
      descripcion: 'Debe ser llevado ante un juez dentro de 24 horas.',
      icono: '⏰',
    },
    {
      titulo: 'Trato digno',
      descripcion: 'Prohibicion de torturas, tratos crueles o degradantes.',
      icono: '🛡️',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-indigo-400 mb-6">Derechos del Imputado</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {derechos.map((d, i) => (
            <div key={i} className="bg-gray-700/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{d.icono}</span>
                <div>
                  <h3 className="text-white font-semibold">{d.titulo}</h3>
                  <p className="text-gray-400 text-sm mt-1">{d.descripcion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
        <h4 className="text-yellow-400 font-semibold mb-2">Si es Detenido</h4>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Mantega la calma y no oponga resistencia</li>
          <li>• Pida identificacion del funcionario</li>
          <li>• No firme nada sin su abogado presente</li>
          <li>• Solicite llamar a un familiar o a la DPP</li>
          <li>• No haga declaraciones sin abogado</li>
        </ul>
      </div>
    </motion.div>
  );
}

function ProcesoView() {
  const etapas = [
    { nombre: 'Detencion', descripcion: 'Privacion de libertad por flagrancia u orden judicial', tiempo: 'Maximo 24 hrs' },
    { nombre: 'Control de Detencion', descripcion: 'Juez verifica legalidad de la detencion', tiempo: '24 hrs desde detencion' },
    { nombre: 'Formalizacion', descripcion: 'Fiscalia comunica cargos formalmente', tiempo: 'Variable' },
    { nombre: 'Medidas Cautelares', descripcion: 'Prision preventiva, arraigo u otras', tiempo: 'En audiencia' },
    { nombre: 'Investigacion', descripcion: 'Fiscalia reune pruebas', tiempo: 'Hasta 2 anos' },
    { nombre: 'Cierre Investigacion', descripcion: 'Fiscalia decide acusar, sobreseer o no perseverar', tiempo: 'Fin plazo' },
    { nombre: 'Acusacion', descripcion: 'Fiscalia presenta acusacion formal', tiempo: '10 dias' },
    { nombre: 'Preparacion Juicio', descripcion: 'Se fijan pruebas y hechos a probar', tiempo: '1 audiencia' },
    { nombre: 'Juicio Oral', descripcion: 'Se presenta prueba ante tribunal', tiempo: '1-5 dias' },
    { nombre: 'Sentencia', descripcion: 'Absolucion o condena', tiempo: 'Inmediata' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-indigo-400 mb-6">Etapas del Proceso Penal</h2>

        <div className="relative">
          {etapas.map((etapa, i) => (
            <div key={i} className="flex gap-4 mb-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {i + 1}
                </div>
                {i < etapas.length - 1 && <div className="w-0.5 h-full bg-gray-600 mt-2" />}
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-white font-semibold">{etapa.nombre}</h3>
                  <span className="text-indigo-400 text-sm">{etapa.tiempo}</span>
                </div>
                <p className="text-gray-400 text-sm mt-1">{etapa.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
          <h4 className="text-green-400 font-semibold mb-2">Salidas Alternativas</h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Suspension condicional</li>
            <li>• Acuerdo reparatorio</li>
            <li>• Procedimiento abreviado</li>
            <li>• Principio de oportunidad</li>
          </ul>
        </div>

        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
          <h4 className="text-blue-400 font-semibold mb-2">Recursos</h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Recurso de nulidad (10 dias)</li>
            <li>• Apelacion de cautelares</li>
            <li>• Amparo ante detencion ilegal</li>
            <li>• Revision de sentencia firme</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function ContactoView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-red-900/30 border border-red-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-red-400 mb-2">Linea de Emergencia 24/7</h2>
        <p className="text-5xl font-bold text-white my-4">600 440 0800</p>
        <p className="text-gray-300">
          Disponible las 24 horas del dia, todos los dias del ano.
          Llame si usted o un familiar ha sido detenido.
        </p>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-indigo-400 mb-6">Oficinas Regionales</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            { region: 'Metropolitana', direccion: 'Agustinas 1419', telefono: '(2) 2439 6800' },
            { region: 'Valparaiso', direccion: 'Blanco 1791', telefono: '(32) 250 8100' },
            { region: 'Biobio', direccion: 'Anibal Pinto 442', telefono: '(41) 246 4500' },
            { region: 'La Araucania', direccion: 'Bulnes 590', telefono: '(45) 220 6200' },
          ].map((o, i) => (
            <div key={i} className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-white font-semibold">{o.region}</h3>
              <p className="text-gray-400 text-sm mt-1">{o.direccion}</p>
              <p className="text-indigo-400 text-sm">{o.telefono}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Recursos en Linea</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { name: 'Defensoria Penal Publica', url: 'https://www.dpp.cl', desc: 'Sitio oficial de la DPP' },
            { name: 'Consulta de Causas', url: 'https://www.dpp.cl/defensoriapublica/consulta_causas', desc: 'Estado de su causa' },
            { name: 'Poder Judicial', url: 'https://www.pjud.cl', desc: 'Tribunales y audiencias' },
            { name: 'Ministerio Publico', url: 'https://www.fiscaliadechile.cl', desc: 'Fiscalia de Chile' },
          ].map((r, i) => (
            <a
              key={i}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gray-700/50 hover:bg-gray-700 rounded-lg p-4 transition-colors"
            >
              <h4 className="text-indigo-400 font-semibold">{r.name}</h4>
              <p className="text-gray-400 text-sm mt-1">{r.desc}</p>
            </a>
          ))}
        </div>
      </div>

      <div className="bg-indigo-900/30 border border-indigo-700 rounded-lg p-4">
        <h4 className="text-indigo-400 font-semibold mb-2">Atencion Presencial</h4>
        <p className="text-gray-300 text-sm">
          Las oficinas de la DPP atienden de lunes a viernes de 8:30 a 17:30 hrs.
          Para detenciones fuera de horario, llame al 600 440 0800.
        </p>
      </div>
    </motion.div>
  );
}

export default function DefensoriaModule() {
  const [activeTab, setActiveTab] = useState<Tab>('inicio');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'inicio', label: 'Inicio', icon: '🏠' },
    { id: 'verificador', label: 'Verificador', icon: '✅' },
    { id: 'derechos', label: 'Derechos', icon: '⚖️' },
    { id: 'proceso', label: 'Proceso', icon: '📋' },
    { id: 'contacto', label: 'Contacto', icon: '📞' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚖️</span>
              <div>
                <h1 className="text-xl font-bold text-white">Defensoria Penal Publica</h1>
                <p className="text-sm text-gray-400">NewCooltura Informada</p>
              </div>
            </div>
            <a
              href="https://newcool-informada.vercel.app"
              className="text-indigo-400 hover:text-indigo-300 text-sm"
            >
              ← Volver al Hub
            </a>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-indigo-400 border-indigo-400'
                    : 'text-gray-400 border-transparent hover:text-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'inicio' && <InicioView key="inicio" />}
          {activeTab === 'verificador' && <VerificadorRequisitos key="verificador" />}
          {activeTab === 'derechos' && <DerechosView key="derechos" />}
          {activeTab === 'proceso' && <ProcesoView key="proceso" />}
          {activeTab === 'contacto' && <ContactoView key="contacto" />}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          <p>La defensa penal es un derecho garantizado por la Constitucion.</p>
          <p className="mt-2 text-indigo-400 font-semibold">Emergencias: 600 440 0800</p>
        </div>
      </footer>
    </div>
  );
}
