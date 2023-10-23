import { ChangeEvent, useEffect, useState } from "react";
import "./App.css";

interface Proceso {
  Proceso: number;
  Arribo: number;
  Previsto: number;
  PrevistoH: number;
  Servicio: number;
  ServicioH: number;
  IO: number;
  TR: number;
  TRN: number;
  TE: number;
}

//HACER TODAS LAS LOGICAS JUNTAS Y LUEGO AL FINAL RECIEN ACTUALIZAR TODO!!! EN EL SET DE CADA UNO. IR TRABAJANDO CON EL CONST LOCAL PARA COORDINAR LOS DATOS.

function App() {
  const [count, setCount] = useState(-1);
  const [numeroProcesos, setNumeroProcesos] = useState(-1);
  const [inicial, setInicial] = useState<Proceso[]>([]); //upInicial
  const [nuevo, setNuevo] = useState<Proceso[]>([]); //upNuevo
  const [listo, setListo] = useState<Proceso[]>([]); //upListo
  const [bloqueado, setBloqueado] = useState<Proceso[]>([]); //actBloqueado
  const [procesar, setProcesar] = useState<Proceso[]>([]); //actProcesar
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
        IO: 0,
        TR: 0,
        TRN: 0,
        TE: 0,
      },
      {
        Proceso: 2,
        Arribo: 4,
        Previsto: 20,
        PrevistoH: 20,
        Servicio: 30,
        ServicioH: 30,
        IO: 0,
        TR: 0,
        TRN: 0,
        TE: 0,
      },
      {
        Proceso: 3,
        Arribo: 8,
        Previsto: 5,
        PrevistoH: 5,
        Servicio: 15,
        ServicioH: 15,
        IO: 0,
        TR: 0,
        TRN: 0,
        TE: 0,
      },
      {
        Proceso: 4,
        Arribo: 10,
        Previsto: 15,
        PrevistoH: 15,
        Servicio: 30,
        ServicioH: 30,
        IO: 0,
        TR: 0,
        TRN: 0,
        TE: 0,
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
        IO: 0,
        TR: 0,
        TRN: 0,
        TE: 0,
      },
      {
        Proceso: 2,
        Arribo: 4,
        Previsto: 2,
        PrevistoH: 2,
        Servicio: 3,
        ServicioH: 3,
        IO: 0,
        TR: 0,
        TRN: 0,
        TE: 0,
      },
      {
        Proceso: 3,
        Arribo: 8,
        Previsto: 5,
        PrevistoH: 5,
        Servicio: 6,
        ServicioH: 6,
        IO: 0,
        TR: 0,
        TRN: 0,
        TE: 0,
      },
      {
        Proceso: 4,
        Arribo: 10,
        Previsto: 5,
        PrevistoH: 5,
        Servicio: 10,
        ServicioH: 10,
        IO: 0,
        TR: 0,
        TRN: 0,
        TE: 0,
      },
    ]);
    setNumeroProcesos(4);
  };
  useEffect(() => {
    setInicial(nuevo);
  }, [nuevo])
  

  useEffect(() => {
    cargarArreglo();
    setQuantum(1);
    setIo(1);
  }, []);

  //FCFS*******************************************************************************
  const FCFS = () => {
    const upCount = count + 1;
    const upListo = listo;

    //NUEVO y LISTO
    const upNuevo = nuevo.filter((value) => {
      if (value.Arribo === upCount) {
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
          const retorno = upCount - value.Arribo;
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

  //ROUND ROBIN*******************************************************************************
  const RR = () => {
    const upCount = count + 1;
    const upListo = listo;

    //NUEVO y LISTO queda igual
    const upNuevo = nuevo.filter((value) => {
      if (value.Arribo === upCount) {
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
          const retorno = upCount - value.Arribo;
          upFinalizado.push({ ...value, TR: retorno, TRN: (retorno / value.ServicioH), TE: (retorno - value.ServicioH - io) });
          setFinalizado(upFinalizado);
          return false; // Elimina el elemento de nuevo
        } else {
          if (upQuantumEC === 0 || value.Previsto === 0) {
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
      setQuantumEC(quantum); //Cargo el quantum para descontar
      upProcesar.push(upListo[0]); //Agrego el 1 elemento de listo a procesar
      upListo.shift(); //Elimino el 1 elemento de listo
    }
    setProcesar(upProcesar);
    setListo(upListo);
    setBloqueado(upBloqueado);
    setCount(upCount);
  };

  //SJF*******************************************************************************
  const SJF = () => {
    const upCount = count + 1;
    const upListo = listo;

    //NUEVO y LISTO
    const upNuevo = nuevo.filter((value) => {
      if (value.Arribo === upCount) {
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
          const retorno = upCount - value.Arribo;
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

  //SRT*******************************************************************************
  const SRT = () => {
    const upCount = count + 1;
    const upListo = listo;

    //NUEVO y LISTO
    const upNuevo = nuevo.filter((value) => {
      if (value.Arribo === upCount) {
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
          const retorno = upCount - value.Arribo;
          upFinalizado.push({ ...value, TR: retorno, TRN: (retorno / value.ServicioH), TE: (retorno - value.ServicioH - io) });
          setFinalizado(upFinalizado);
          return false; // Elimina el elemento de nuevo
        } else {
          if (value.Previsto > upListo[0]?.Previsto || value.Previsto === 0) {
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

  // Deshabilita los otros botones
  const [habilitados, setHabilitados] = useState({
    FCFS: true,
    RR: true,
    SJF: true,
    SRT: true,
    tiempo: false,
  });
  const habilitarBotones = (value: string) => {
    setHabilitados({
      FCFS: value === "FCFS",
      RR: value === "RR",
      SJF: value === "SJF",
      SRT: value === "SRT",
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
    if (habilitados.RR) {
      RR();
    }
    if (habilitados.SJF) {
      SJF();
    }
    if (habilitados.SRT) {
      SRT();
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
            onClick={() => habilitarBotones("RR")}
            disabled={!habilitados.RR}
          >
            RR
          </button>
          <button
            onClick={() => habilitarBotones("SJF")}
            disabled={!habilitados.SJF}
          >
            SJF
          </button>
          <button
            onClick={() => habilitarBotones("SRT")}
            disabled={!habilitados.SRT}
          >
            SRT
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
                Proceso {item.Proceso} Arribo {item.Arribo}
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
                Proceso {item.Proceso} Previsto {item.Previsto} Servicio{" "}
                {item.Servicio}
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
                Proceso {item.Proceso} Previsto {item.Previsto} Servicio{" "}
                {item.Servicio}
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
                Proceso {item.Proceso} Previsto {item.Previsto} PrevistoAlIniciar {item.PrevistoH} Arribo {item.Arribo} Servicio {item.Servicio} ServicioAlIniciar {item.ServicioH}
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
                Proceso {item.Proceso} TRN {item.TRN}
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
