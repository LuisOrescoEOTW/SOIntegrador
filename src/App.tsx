//DAle que va

import { ChangeEvent, useEffect, useState } from "react";
import "./App.css";

interface Proceso {
  Proceso: number;
  Arribo: number;
  Previsto: number;
  PrevistoH: number;
  Servicio: number;
  ServicioH: number;
  Prioridad: number;
  IO: number;
  TR: number;
  TRN: number;
  TE: number;
  TFP: number;
  TCP: number;
}

function App() {
  const [count, setCount] = useState(-1);
  const [numeroProcesos, setNumeroProcesos] = useState(-1);
  // const [inicial, setInicial] = useState<Proceso[]>([]); //upInicial
  const [nuevo, setNuevo] = useState<Proceso[]>([]); //upNuevo
  const [listo, setListo] = useState<Proceso[]>([]); //upListo
  const [bloqueado, setBloqueado] = useState<Proceso[]>([]); //actBloqueado
  const [procesar, setProcesar] = useState<Proceso[]>([]); //actProcesar
  const [desasignoRecursos, setDesasignoRecursos] = useState<Proceso[]>([]); //actDesasignoRecursos
  const [finalizado, setFinalizado] = useState<Proceso[]>([]); //upFinalizado

  //Para hacer un commit
  const cargarArregloOriginal = () => {
    setNuevo([
      {
        Proceso: 1,
        Arribo: 0,
        Previsto: 10,
        PrevistoH: 10,
        Servicio: 20,
        ServicioH: 20,
        Prioridad: 1,
        IO: 0,
        TR: 0,
        TRN: 0,
        TE: 0,
        TFP: 0,
        TCP: 0,
      },
      {
        Proceso: 2,
        Arribo: 4,
        Previsto: 20,
        PrevistoH: 20,
        Servicio: 30,
        ServicioH: 30,
        Prioridad: 2,
        IO: 0,
        TR: 0,
        TRN: 0,
        TE: 0,
        TFP: 0,
        TCP: 0,
      },
      {
        Proceso: 3,
        Arribo: 8,
        Previsto: 5,
        PrevistoH: 5,
        Servicio: 15,
        ServicioH: 15,
        Prioridad: 4,
        IO: 0,
        TR: 0,
        TRN: 0,
        TE: 0,
        TFP: 0,
        TCP: 0,
      },
      {
        Proceso: 4,
        Arribo: 10,
        Previsto: 15,
        PrevistoH: 15,
        Servicio: 30,
        ServicioH: 30,
        Prioridad: 3,
        IO: 0,
        TR: 0,
        TRN: 0,
        TE: 0,
        TFP: 0,
        TCP: 0,
      },
    ]);
    setNumeroProcesos(4);
  };

  //Este es un arreglo corto solo para pruebas rápidas.
  const cargarArreglo = () => {
    setNuevo([
      {
        Proceso: 1,
        Arribo: 0,
        Previsto: 2,
        PrevistoH: 2,
        Servicio: 4,
        ServicioH: 4,
        Prioridad: 10,
        IO: 0,
        TR: 0,
        TRN: 0,
        TE: 0,
        TFP: 0,
        TCP: 0,
      },
      {
        Proceso: 2,
        Arribo: 4,
        Previsto: 2,
        PrevistoH: 2,
        Servicio: 3,
        ServicioH: 3,
        Prioridad: 9,
        IO: 0,
        TR: 0,
        TRN: 0,
        TE: 0,
        TFP: 0,
        TCP: 0,
      },
      {
        Proceso: 3,
        Arribo: 8,
        Previsto: 5,
        PrevistoH: 5,
        Servicio: 6,
        ServicioH: 6,
        Prioridad: 1,
        IO: 0,
        TR: 0,
        TRN: 0,
        TE: 0,
        TFP: 0,
        TCP: 0,
      },
      {
        Proceso: 4,
        Arribo: 10,
        Previsto: 5,
        PrevistoH: 5,
        Servicio: 10,
        ServicioH: 10,
        Prioridad: 5,
        IO: 0,
        TR: 0,
        TRN: 0,
        TE: 0,
        TFP: 0,
        TCP: 0,
      },
    ]);
    setNumeroProcesos(4);
  };
  // useEffect(() => {
  //   setInicial(nuevo);
  // }, [nuevo])


  useEffect(() => {
    cargarArreglo();
    setQuantum(1);
    setIo(1);
  }, []);

  //FCFS*******************************************************************************
  const FCFS = () => {
    const upCount = count + 1;
    const upListo = listo;
    const upFinalizado = finalizado;

    //NUEVO y LISTO
    const upNuevo = nuevo.filter((value) => {
      if (value.Arribo + tip === upCount) {
        upListo.push(value);
        return false; // Elimina el elemento de nuevo
      }
      return true; // Mantiene el elemento en nuevo
    });
    setNuevo(upNuevo);

    //BLOQUEADO
    //Disminuye en 1 el IO de todos los bloqueados
    const actBloqueado = bloqueado.map((value) => {
      return { ...value, IO: value.IO - 1 };
    });
    //Quita de la lista de bloqueados ya agrega en Listos
    const upBloqueado = actBloqueado.filter((value) => {
      if (value.IO === 0) {
        //Cargo en Listo el proceso seteado con IO cargado
        upListo.push(value);
        return false; // Elimina el elemento de nuevo
      }
      return true; // Mantiene el elemento en nuevo
    });

    //DESASIGNAR RECURSOS
    const actDesasignoRecursos = desasignoRecursos.map((value) => {
      return { ...value, TFP: value.TFP - 1 };
    });
    //Quita de la lista de desasignar recursos y agrega en Finalizados
    const upDesasignoRecursos = actDesasignoRecursos.filter((value) => {
      if (value.TFP === 0) {
        //Cargo en Finalizado
        const retornos = upCount - value.Arribo - tip;
        upFinalizado.push({ ...value, TR: retornos, TRN: (retornos / value.ServicioH), TE: (retornos - value.ServicioH - io) });
        return false; // Elimina el elemento de nuevo
      }
      return true; // Mantiene el elemento en nuevo
    });
    
    //PROCESAR
    let upProcesar = procesar;
    if (procesar.length > 0) {
      //Disminuye el tiempo procesado en previsto y servicio
      const actProcesar = procesar.map((value) => {
        return {
          ...value,
          Previsto: value.Previsto - 1,
          Servicio: value.Servicio - 1,
        };
      });
      //Quita de la lista los procesados finalizados
      upProcesar = actProcesar.filter((value) => {
        if (value.Servicio === 0) {
          if (tfp === 0){
            const retorno = upCount - value.Arribo - tip;
            upFinalizado.push({ ...value, TR: retorno, TRN: (retorno / value.ServicioH), TE: (retorno - value.ServicioH - io) });
            setFinalizado(upFinalizado);
          } else {
            upDesasignoRecursos.push({ ...value,  TFP: tfp});
          }
          return false; // Elimina el elemento de nuevo
        } else {
          if (value.Previsto === 0) {
            upBloqueado.push({
              ...value,
              Previsto:
              value.Servicio < value.PrevistoH
              ? value.Servicio
              : value.PrevistoH,
              IO: io,
            });
            return false; // Elimina el elemento de nuevo
          } else {
            return true; // Mantiene el elemento en nuevo
          }
        }
      });
    }
    // Verifica si procesar esta vacio y listo tiene elementos
    if (upProcesar.length == 0 && upListo.length > 0) {
      upProcesar.push(upListo[0]); //Agrego el 1 elemento de listo a procesar
      upListo.shift(); //Elimino el 1 elemento de listo
    }
    
    setDesasignoRecursos(upDesasignoRecursos)
    setFinalizado(upFinalizado);
    setProcesar(upProcesar);
    setListo(upListo);
    setBloqueado(upBloqueado);
    setCount(upCount);
  };

  //Prioridad*******************************************************************************
  //El de mayor valor es mas prioridad
  const Prioridad = () => {
    const upCount = count + 1;
    const upListo = listo;

    //NUEVO y LISTO
    const upNuevo = nuevo.filter((value) => {
      if (value.Arribo + tip === upCount) {
        upListo.push(value);
        return false; // Elimina el elemento de nuevo
      }
      return true; // Mantiene el elemento en nuevo
    });
    setNuevo(upNuevo);

    //BLOQUEADO
    //Disminuye en 1 el IO de todos los bloqueados
    const actBloqueado = bloqueado.map((value) => {
      return { ...value, IO: value.IO - 1 };
    });
    //Quita de la lista de bloqueados ya agrega en Listos
    const upBloqueado = actBloqueado.filter((value) => {
      if (value.IO === 0) {
        //Cargo en Listo el proceso seteado con IO cargado
        upListo.push({ ...value });
        return false; // Elimina el elemento de nuevo
      }
      return true; // Mantiene el elemento en nuevo
    });

    //Ordeno upListo de menor a mayor por Prioridad
    upListo.sort((a, b) => a.Prioridad - b.Prioridad);

    //PROCESAR
    let upProcesar = procesar;
    if (procesar.length > 0) {
      //Disminuye el tiempo procesado en previsto y servicio
      const actProcesar = procesar.map((value) => {
        return {
          ...value,
          Previsto: value.Previsto - 1,
          Servicio: value.Servicio - 1,
        };
      });
      //Quita de la lista los procesados finalizados
      upProcesar = actProcesar.filter((value) => {
        if (value.Servicio === 0) {
          const upFinalizado = finalizado;
          const retorno = upCount - value.Arribo - tip;
          upFinalizado.push({ ...value, TR: retorno, TRN: (retorno / value.ServicioH), TE: (retorno - value.ServicioH - io) });
          setFinalizado(upFinalizado);
          return false; // Elimina el elemento de nuevo
        } else {
          if (value.Prioridad < upListo[0]?.Prioridad || value.Previsto === 0) {
            if (value.Previsto === 0) {
              upBloqueado.push({
                ...value,
                Previsto:
                  value.Servicio < value.PrevistoH
                    ? value.Servicio
                    : value.PrevistoH,
                IO: io,
              });
            } else {
              upListo.push({
                ...value,
                Previsto:
                  value.Servicio < value.PrevistoH
                    ? value.Servicio
                    : value.PrevistoH
              });
            }
            return false; // Elimina el elemento de nuevo
          } else {
            return true; // Mantiene el elemento en nuevo
          }
        }
      });
    }
    // Verifica si procesar esta vacio y listo tiene elementos
    if (upProcesar.length == 0 && upListo.length > 0) {
      upProcesar.push(upListo[0]); //Agrego el 1 elemento de listo a procesar
      upListo.shift(); //Elimino el 1 elemento de listo
    }
    setProcesar(upProcesar);
    setListo(upListo);
    setBloqueado(upBloqueado);
    setCount(upCount);
  };

  //ROUND ROBIN*******************************************************************************
  const RR = () => {
    const upCount = count + 1;
    const upListo = listo;

    //NUEVO y LISTO queda igual
    const upNuevo = nuevo.filter((value) => {
      if (value.Arribo + tip === upCount) {
        upListo.push(value);
        return false; // Elimina el elemento de nuevo
      }
      return true; // Mantiene el elemento en nuevo
    });
    setNuevo(upNuevo);

    //BLOQUEADO queda igual
    //Disminuye en 1 el IO de todos los bloqueados
    const actBloqueado = bloqueado.map((value) => {
      return { ...value, IO: value.IO - 1 };
    });
    //Quita de la lista de bloqueados ya agrega en Listos
    const upBloqueado = actBloqueado.filter((value) => {
      if (value.IO === 0) {
        //Cargo en Listo el proceso seteado con IO cargado
        upListo.push({ ...value });
        return false; // Elimina el elemento de nuevo
      }
      return true; // Mantiene el elemento en nuevo
    });

    //PROCESAR
    let upProcesar = procesar;
    if (procesar.length > 0) {
      //Disminuye el quantum procesado en previsto y servicio
      const upQuantumEC = quantumEC - 1;
      setQuantumEC(upQuantumEC);
      const actProcesar = procesar.map((value) => {
        return {
          ...value,
          Previsto: value.Previsto - 1,
          Servicio: value.Servicio - 1,
        };
      });
      //Quita de la lista los procesados finalizados
      upProcesar = actProcesar.filter((value) => {
        if (value.Servicio === 0) {
          const upFinalizado = finalizado;
          const retorno = upCount - value.Arribo - tip;
          upFinalizado.push({ ...value, TR: retorno, TRN: (retorno / value.ServicioH), TE: (retorno - value.ServicioH - io) });
          setFinalizado(upFinalizado);
          return false; // Elimina el elemento de nuevo
        } else {
          if (upQuantumEC === 0 || value.Previsto === 0) {
            if (upQuantumEC === 0) {
              upListo.push({
                ...value,
                Previsto:
                  value.Servicio < value.PrevistoH
                    ? value.Servicio
                    : value.PrevistoH,
              });
            } else {
              upBloqueado.push({
                ...value,
                Previsto:
                  value.Servicio < value.PrevistoH
                    ? value.Servicio
                    : value.PrevistoH,
                IO: io,
              });
            }
            return false; // Elimina el elemento de nuevo
          } else {
            return true; // Mantiene el elemento en nuevo
          }
        }
      });
    }
    // Verifica si procesar esta vacio y listo tiene elementos
    if (upProcesar.length == 0 && upListo.length > 0) {
      setQuantumEC(quantum); //Cargo el quantum para descontar
      upProcesar.push(upListo[0]); //Agrego el 1 elemento de listo a procesar
      upListo.shift(); //Elimino el 1 elemento de listo
    }
    setProcesar(upProcesar);
    setListo(upListo);
    setBloqueado(upBloqueado);
    setCount(upCount);
  };

  //SPN*******************************************************************************
  const SPN = () => {
    const upCount = count + 1;
    const upListo = listo;

    //NUEVO y LISTO
    const upNuevo = nuevo.filter((value) => {
      if (value.Arribo + tip === upCount) {
        upListo.push(value);
        return false; // Elimina el elemento de nuevo
      }
      return true; // Mantiene el elemento en nuevo
    });
    setNuevo(upNuevo);

    //BLOQUEADO
    //Disminuye en 1 el IO de todos los bloqueados
    const actBloqueado = bloqueado.map((value) => {
      return { ...value, IO: value.IO - 1 };
    });
    //Quita de la lista de bloqueados ya agrega en Listos
    const upBloqueado = actBloqueado.filter((value) => {
      if (value.IO === 0) {
        //Cargo en Listo el proceso seteado con IO cargado
        upListo.push({ ...value });
        return false; // Elimina el elemento de nuevo
      }
      return true; // Mantiene el elemento en nuevo
    });

    //Ordeno upListo de menor a mayor por Servicio
    upListo.sort((a, b) => a.Previsto - b.Previsto);

    //PROCESAR
    let upProcesar = procesar;
    if (procesar.length > 0) {
      //Disminuye el tiempo procesado en previsto y servicio
      const actProcesar = procesar.map((value) => {
        return {
          ...value,
          Previsto: value.Previsto - 1,
          Servicio: value.Servicio - 1,
        };
      });
      //Quita de la lista los procesados finalizados
      upProcesar = actProcesar.filter((value) => {
        if (value.Servicio === 0) {
          const upFinalizado = finalizado;
          const retorno = upCount - value.Arribo - tip;
          upFinalizado.push({ ...value, TR: retorno, TRN: (retorno / value.ServicioH), TE: (retorno - value.ServicioH - io) });
          setFinalizado(upFinalizado);
          return false; // Elimina el elemento de nuevo
        } else {
          if (value.Previsto === 0) {
            upBloqueado.push({
              ...value,
              Previsto:
                value.Servicio < value.PrevistoH
                  ? value.Servicio
                  : value.PrevistoH,
              IO: io,
            });
            return false; // Elimina el elemento de nuevo
          } else {
            return true; // Mantiene el elemento en nuevo
          }
        }
      });
    }
    // Verifica si procesar esta vacio y listo tiene elementos
    if (upProcesar.length == 0 && upListo.length > 0) {
      upProcesar.push(upListo[0]); //Agrego el 1 elemento de listo a procesar
      upListo.shift(); //Elimino el 1 elemento de listo
    }
    setProcesar(upProcesar);
    setListo(upListo);
    setBloqueado(upBloqueado);
    setCount(upCount);
  };

  //SRTN*******************************************************************************
  const SRTN = () => {
    const upCount = count + 1;
    const upListo = listo;

    //NUEVO y LISTO
    const upNuevo = nuevo.filter((value) => {
      if (value.Arribo + tip === upCount) {
        upListo.push(value);
        return false; // Elimina el elemento de nuevo
      }
      return true; // Mantiene el elemento en nuevo
    });
    setNuevo(upNuevo);

    //BLOQUEADO
    //Disminuye en 1 el IO de todos los bloqueados
    const actBloqueado = bloqueado.map((value) => {
      return { ...value, IO: value.IO - 1 };
    });
    //Quita de la lista de bloqueados ya agrega en Listos
    const upBloqueado = actBloqueado.filter((value) => {
      if (value.IO === 0) {
        //Cargo en Listo el proceso seteado con IO cargado
        upListo.push({ ...value });
        return false; // Elimina el elemento de nuevo
      }
      return true; // Mantiene el elemento en nuevo
    });

    //Ordeno upListo de menor a mayor por Servicio
    upListo.sort((a, b) => a.Previsto - b.Previsto);

    //PROCESAR
    let upProcesar = procesar;
    if (procesar.length > 0) {
      //Disminuye el tiempo procesado en previsto y servicio
      const actProcesar = procesar.map((value) => {
        return {
          ...value,
          Previsto: value.Previsto - 1,
          Servicio: value.Servicio - 1,
        };
      });
      //Quita de la lista los procesados finalizados
      upProcesar = actProcesar.filter((value) => {
        if (value.Servicio === 0) {
          const upFinalizado = finalizado;
          const retorno = upCount - value.Arribo - tip;
          upFinalizado.push({ ...value, TR: retorno, TRN: (retorno / value.ServicioH), TE: (retorno - value.ServicioH - io) });
          setFinalizado(upFinalizado);
          return false; // Elimina el elemento de nuevo
        } else {
          if (value.Previsto > upListo[0]?.Previsto || value.Previsto === 0) {
            if (value.Previsto === 0) {
              upBloqueado.push({
                ...value,
                Previsto:
                  value.Servicio < value.PrevistoH
                    ? value.Servicio
                    : value.PrevistoH,
                IO: io,
              });
            } else {
              upListo.push({
                ...value,
                Previsto:
                  value.Servicio < value.PrevistoH
                    ? value.Servicio
                    : value.PrevistoH,
              });
            }
            return false; // Elimina el elemento de nuevo
          } else {
            return true; // Mantiene el elemento en nuevo
          }
        }
      });
    }
    // Verifica si procesar esta vacio y listo tiene elementos
    if (upProcesar.length == 0 && upListo.length > 0) {
      upProcesar.push(upListo[0]); //Agrego el 1 elemento de listo a procesar
      upListo.shift(); //Elimino el 1 elemento de listo
    }
    setProcesar(upProcesar);
    setListo(upListo);
    setBloqueado(upBloqueado);
    setCount(upCount);
  };

  // Definir un "quantum" para almacenar el valor numérico
  const [quantum, setQuantum] = useState<number>(0);
  const [quantumEC, setQuantumEC] = useState<number>(0);
  const handleQuantumChange = (event: ChangeEvent<HTMLInputElement>) => {
    const valor =
      parseInt(event.target.value) === 0 ? 1 : parseInt(event.target.value);
    setQuantum(valor);
  };

  // Definir un "IO" para almacenar el valor numérico
  const [io, setIo] = useState<number>(0);
  const handleIOChange = (event: ChangeEvent<HTMLInputElement>) => {
    const valor =
      parseInt(event.target.value) === 0 ? 1 : parseInt(event.target.value);
    setIo(valor);
  };
  // Definir un "TIP" para almacenar el valor numérico
  const [tip, setTip] = useState<number>(0);
  const handleTip = (event: ChangeEvent<HTMLInputElement>) => {
    const valor =
      parseInt(event.target.value) === -1 ? 0 : parseInt(event.target.value);
    setTip(valor);
  };
  // Definir un "TFP" para almacenar el valor numérico
  const [tfp, setTfp] = useState<number>(0);
  const handleTfp = (event: ChangeEvent<HTMLInputElement>) => {
    const valor =
      parseInt(event.target.value) === -1 ? 0 : parseInt(event.target.value);
    setTfp(valor);
  };
  // Definir un "TCP" para almacenar el valor numérico
  const [tcp, setTcp] = useState<number>(0);
  const handleTcp = (event: ChangeEvent<HTMLInputElement>) => {
    const valor =
      parseInt(event.target.value) === -1 ? 0 : parseInt(event.target.value);
    setTcp(valor);
  };

  // Deshabilita los otros botones
  const [habilitados, setHabilitados] = useState({
    FCFS: true,
    Prioridad: true,
    RR: true,
    SPN: true,
    SRTN: true,
    tiempo: false,
  });
  const habilitarBotones = (value: string) => {
    setHabilitados({
      FCFS: value === "FCFS",
      Prioridad: value === "Prioridad",
      RR: value === "RR",
      SPN: value === "SPN",
      SRTN: value === "SRTN",
      tiempo: true,
    });
  };

  //Cálculos Finales
  const [verCalculos, setVerCalculos] = useState(false);
  const [TMRT, setTMRT] = useState(0);
  const [TME, setTME] = useState(0);
  const calculosFinales = () => {
    let getSumTRCT = 0;
    finalizado.map((value) => {
      getSumTRCT = getSumTRCT + value.TR;
    });
    setTMRT(getSumTRCT / finalizado.length);
    let getSumTME = 0;
    finalizado.map((value) => {
      getSumTME = getSumTME + value.TE;
    });
    setTME(getSumTME / finalizado.length);
    setVerCalculos(true);
  };

  //Avance del tiempo
  const avanzarTiempo = () => {
    if (habilitados.FCFS) {
      FCFS();
    }
    if (habilitados.Prioridad) {
      Prioridad();
    }
    if (habilitados.RR) {
      RR();
    }
    if (habilitados.SPN) {
      SPN();
    }
    if (habilitados.SRTN) {
      SRTN();
    }
    if (finalizado.length === numeroProcesos) {
      habilitados.tiempo = false;
      calculosFinales();
    }
  };

  return (
    <>
      <h1>- Sistemas Operativos -</h1>

      <div>
        <label htmlFor="ioField">I/O: </label>
        <input
          type="number"
          id="ioField"
          value={io}
          onChange={handleIOChange}
        />
      </div>
      <div>
        <label htmlFor="quantumField">Quantum: </label>
        <input
          type="number"
          id="quantumField"
          value={quantum}
          onChange={handleQuantumChange}
        />
      </div>
      <div>
        <label htmlFor="tipField">TIP: </label>
        <input
          type="number"
          id="tipField"
          value={tip}
          onChange={handleTip}
        />
      </div>
      <div>
        <label htmlFor="tfpField">TFP: </label>
        <input
          type="number"
          id="tfpField"
          value={tfp}
          onChange={handleTfp}
        />
      </div>
      <div>
        <label htmlFor="tcpField">TCP: </label>
        <input
          type="number"
          id="tcpField"
          value={tcp}
          onChange={handleTcp}
        />
      </div>

      <div className="card">
        <p>TIEMPO {count}</p>

        <div>
          <button
            onClick={() => habilitarBotones("FCFS")}
            disabled={!habilitados.FCFS}
          >
            FCFS
          </button>
          <button
            onClick={() => habilitarBotones("Prioridad")}
            disabled={!habilitados.Prioridad}
          >
            Prioridad
          </button>
          <button
            onClick={() => habilitarBotones("RR")}
            disabled={!habilitados.RR}
          >
            RR
          </button>
          <button
            onClick={() => habilitarBotones("SPN")}
            disabled={!habilitados.SPN}
          >
            SPN
          </button>
          <button
            onClick={() => habilitarBotones("SRTN")}
            disabled={!habilitados.SRTN}
          >
            SRTN
          </button>
        </div>

        <button onClick={avanzarTiempo} disabled={!habilitados.tiempo}>
          Avanzar Tiempo
        </button>
      </div>

      {nuevo && (
        <div>
          <h2>Nuevo:</h2>
          <ul>
            {nuevo.map((item, index) => (
              <li key={index}>
                Proceso {item.Proceso} Arribo {item.Arribo} TIP {item.TIP}
              </li>
            ))}
          </ul>
        </div>
      )}

      {listo && (
        <div>
          <h2>Listo:</h2>
          <ul>
            {listo.map((item, index) => (
              <li key={index}>
                Proceso {item.Proceso} Prioridad {item.Prioridad} Previsto {item.Previsto} Servicio {item.Servicio}
              </li>
            ))}
          </ul>
        </div>
      )}

      {bloqueado && (
        <div>
          <h2>Bloqueado:</h2>
          <ul>
            {bloqueado.map((item, index) => (
              <li key={index}>
                Proceso {item.Proceso} IO {item.IO}
              </li>
            ))}
          </ul>
        </div>
      )}

      {procesar && (
        <div>
          <h2>PROCESANDO: Quantum Procesado: {quantumEC}</h2>
          <ul>
            {procesar.map((item, index) => (
              <li key={index}>
                Proceso {item.Proceso} Prioridad {item.Prioridad} Previsto {item.Previsto} Servicio {item.Servicio}
              </li>
            ))}
          </ul>
        </div>
      )}

      {finalizado && (
        <div>
          <h2>Finalizado:</h2>
          <ul>
            {finalizado.map((item, index) => (
              <li key={index}>
                Proceso {item.Proceso} Previsto {item.Previsto} PrevistoAlIniciar {item.PrevistoH} Arribo {item.Arribo} Servicio {item.Servicio} ServicioAlIniciar {item.ServicioH} Prioridad {item.Prioridad}
              </li>
            ))}
          </ul>
        </div>
      )}

      {verCalculos && (
        <div>
          <h2>CALCULOS</h2>
          <h3>Tiempo de Retorno de Cada Trabajo</h3>
          <ul>
            {finalizado.map((item, index) => (
              <li key={index}>
                Proceso {item.Proceso} TR {item.TR}
              </li>
            ))}
          </ul>
          <h3>Tiempo de Retorno Normalizado de Cada Trabajo</h3>
          <ul>
            {finalizado.map((item, index) => (
              <li key={index}>
                Proceso {item.Proceso} TRN {item.TRN.toFixed(2)}
              </li>
            ))}
          </ul>
          <h3>Tiempo de Retorno de la Tanda</h3>
          <ul>
            <li>{count}</li>
          </ul>
          <h3>Tiempo Medio de Retorno de la Tanda</h3>
          <ul>
            <li>{TMRT}</li>
          </ul>
          <h3>Tiempo de Espera de Cada Trabajo</h3>
          <ul>
            {finalizado.map((item, index) => (
              <li key={index}>
                Proceso {item.Proceso} TE {item.TE}
              </li>
            ))}
          </ul>
          <h3>Tiempo Medio de Espera de la Tanda</h3>
          <ul>
            <li>{TME}</li>
          </ul>
        </div>
      )}
    </>
  );
}

export default App;
