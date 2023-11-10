//DAle que va

import { ChangeEvent, useEffect, useState } from "react";
import "./estilos.css";
import Grid from "@mui/material/Grid";
import { AppBar, Box, Button, Card, LinearProgress, ListItem, Stack, TextField, Toolbar, Typography, styled } from "@mui/material";
import { AddAlarm, CloudUploadOutlined } from "@mui/icons-material";

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
}

function App() {
  const [count, setCount] = useState(-1);
  const [numeroProcesos, setNumeroProcesos] = useState(-1);
  const [nuevo, setNuevo] = useState<Proceso[]>([]); //upNuevo
  const [listo, setListo] = useState<Proceso[]>([]); //upListo
  const [bloqueado, setBloqueado] = useState<Proceso[]>([]); //actBloqueado
  const [procesar, setProcesar] = useState<Proceso[]>([]); //actProcesar
  const [desasignoRecursos, setDesasignoRecursos] = useState<Proceso[]>([]); //actDesasignoRecursos
  const [finalizado, setFinalizado] = useState<Proceso[]>([]); //upFinalizado

  useEffect(() => {
    setNumeroProcesos(5);
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
    let upTcpEP = tcpEP - 1 > 0 ? tcpEP - 1 : 0;
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
          if (tfp === 0) {
            const retorno = upCount - value.Arribo - tip;
            upFinalizado.push({ ...value, TR: retorno, TRN: (retorno / value.ServicioH), TE: (retorno - value.ServicioH - io) });
          } else {
            upDesasignoRecursos.push({ ...value, TFP: tfp });
          }
          upTcpEP = tcp;
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
            upTcpEP = tcp;
            return false; // Elimina el elemento de nuevo
          } else {
            return true; // Mantiene el elemento en nuevo
          }
        }
      });
    }
    // Verifica si procesar esta vacio y listo tiene elementos y no hay tiempo en TCP
    if (upProcesar.length == 0 && upListo.length > 0 && upTcpEP == 0) {
      upProcesar.push(upListo[0]); //Agrego el 1 elemento de listo a procesar
      upListo.shift(); //Elimino el 1 elemento de listo
    }

    setTcpEP(upTcpEP)
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
        upListo.push({ ...value });
        return false; // Elimina el elemento de nuevo
      }
      return true; // Mantiene el elemento en nuevo
    });

    //Ordeno upListo de mayor a menor por Prioridad
    upListo.sort((a, b) => b.Prioridad - a.Prioridad);

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
    let upTcpEP = tcpEP - 1 > 0 ? tcpEP - 1 : 0;
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
          if (tfp === 0) {
            const retorno = upCount - value.Arribo - tip;
            upFinalizado.push({ ...value, TR: retorno, TRN: (retorno / value.ServicioH), TE: (retorno - value.ServicioH - io) });
          } else {
            upDesasignoRecursos.push({ ...value, TFP: tfp });
          }
          upTcpEP = tcp;
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
              //Ordeno upListo de mayor a menor por Prioridad
              upListo.sort((a, b) => b.Prioridad - a.Prioridad);
            }
            upTcpEP = tcp;
            return false; // Elimina el elemento de nuevo
          } else {
            return true; // Mantiene el elemento en nuevo
          }
        }
      });
    }
    // Verifica si procesar esta vacio y listo tiene elementos
    if (upProcesar.length == 0 && upListo.length > 0 && upTcpEP == 0) {
      upProcesar.push(upListo[0]); //Agrego el 1 elemento de listo a procesar
      upListo.shift(); //Elimino el 1 elemento de listo
    }
    setTcpEP(upTcpEP)
    setDesasignoRecursos(upDesasignoRecursos)
    setFinalizado(upFinalizado);
    setProcesar(upProcesar);
    setListo(upListo);
    setBloqueado(upBloqueado);
    setCount(upCount);
  };

  //ROUND ROBIN*******************************************************************************
  const RR = () => {
    const upCount = count + 1;
    const upListo = listo;
    const upFinalizado = finalizado;

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
    let upTcpEP = tcpEP - 1 > 0 ? tcpEP - 1 : 0;
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
          if (tfp === 0) {
            const retorno = upCount - value.Arribo - tip;
            upFinalizado.push({ ...value, TR: retorno, TRN: (retorno / value.ServicioH), TE: (retorno - value.ServicioH - io) });
          } else {
            upDesasignoRecursos.push({ ...value, TFP: tfp });
          }
          upTcpEP = tcp;
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
            upTcpEP = tcp;
            return false; // Elimina el elemento de nuevo
          } else {
            return true; // Mantiene el elemento en nuevo
          }
        }
      });
    }
    // Verifica si procesar esta vacio y listo tiene elementos
    if (upProcesar.length == 0 && upListo.length > 0 && upTcpEP == 0) {
      setQuantumEC(quantum); //Cargo el quantum para descontar
      upProcesar.push(upListo[0]); //Agrego el 1 elemento de listo a procesar
      upListo.shift(); //Elimino el 1 elemento de listo
    }
    setTcpEP(upTcpEP)
    setDesasignoRecursos(upDesasignoRecursos)
    setFinalizado(upFinalizado);
    setProcesar(upProcesar);
    setListo(upListo);
    setBloqueado(upBloqueado);
    setCount(upCount);
  };

  //SPN*******************************************************************************
  const SPN = () => {
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
        upListo.push({ ...value });
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

    //Ordeno upListo de menor a mayor por Servicio
    upListo.sort((a, b) => a.Previsto - b.Previsto);

    //PROCESAR
    let upTcpEP = tcpEP - 1 > 0 ? tcpEP - 1 : 0;
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
          if (tfp === 0) {
            const retorno = upCount - value.Arribo - tip;
            upFinalizado.push({ ...value, TR: retorno, TRN: (retorno / value.ServicioH), TE: (retorno - value.ServicioH - io) });
          } else {
            upDesasignoRecursos.push({ ...value, TFP: tfp });
          }
          upTcpEP = tcp;
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
            upTcpEP = tcp;
            return false; // Elimina el elemento de nuevo
          } else {
            return true; // Mantiene el elemento en nuevo
          }
        }
      });
    }
    // Verifica si procesar esta vacio y listo tiene elementos
    if (upProcesar.length == 0 && upListo.length > 0 && upTcpEP == 0) {
      upProcesar.push(upListo[0]); //Agrego el 1 elemento de listo a procesar
      upListo.shift(); //Elimino el 1 elemento de listo
    }
    setTcpEP(upTcpEP)
    setDesasignoRecursos(upDesasignoRecursos)
    setFinalizado(upFinalizado);
    setProcesar(upProcesar);
    setListo(upListo);
    setBloqueado(upBloqueado);
    setCount(upCount);
  };

  //SRTN*******************************************************************************
  const SRTN = () => {
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
        upListo.push({ ...value });
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

    //Ordeno upListo de menor a mayor por Servicio
    upListo.sort((a, b) => a.Previsto - b.Previsto);

    //PROCESAR
    let upTcpEP = tcpEP - 1 > 0 ? tcpEP - 1 : 0;
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
          if (tfp === 0) {
            const retorno = upCount - value.Arribo - tip;
            upFinalizado.push({ ...value, TR: retorno, TRN: (retorno / value.ServicioH), TE: (retorno - value.ServicioH - io) });
          } else {
            upDesasignoRecursos.push({ ...value, TFP: tfp });
          }
          upTcpEP = tcp;
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
              //Ordeno upListo de menor a mayor por Servicio
              upListo.sort((a, b) => a.Previsto - b.Previsto);
            }
            upTcpEP = tcp;
            return false; // Elimina el elemento de nuevo
          } else {
            return true; // Mantiene el elemento en nuevo
          }
        }
      });
    }
    // Verifica si procesar esta vacio y listo tiene elementos
    if (upProcesar.length == 0 && upListo.length > 0 && upTcpEP == 0) {
      upProcesar.push(upListo[0]); //Agrego el 1 elemento de listo a procesar
      upListo.shift(); //Elimino el 1 elemento de listo
    }
    setTcpEP(upTcpEP)
    setDesasignoRecursos(upDesasignoRecursos)
    setFinalizado(upFinalizado);
    setProcesar(upProcesar);
    setListo(upListo);
    setBloqueado(upBloqueado);
    setCount(upCount);
  };

  // Definir un "quantum" para almacenar el valor numérico
  const [quantum, setQuantum] = useState<number>(1);
  const [quantumEC, setQuantumEC] = useState<number>(0);
  const handleQuantumChange = (event: ChangeEvent<HTMLInputElement>) => {
    const valor =
      parseInt(event.target.value) === 0 ? 1 : parseInt(event.target.value);
    setQuantum(valor);
  };

  // Definir un "IO" para almacenar el valor numérico
  const [io, setIo] = useState<number>(1);
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
  const [tcpEP, setTcpEP] = useState<number>(0);
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

  // Leo el archivo
  const cargarArchivo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Leer el contenido del archivo seleccionado
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const parsedData = JSON.parse(text);
          setNuevo(parsedData);
        } catch (error) {
          console.error('Error al analizar el archivo de texto:', error);
        }
      };
      reader.readAsText(file);
    }
  }


  // *********************************************************************************************************************

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (
    <div>
      <div className="encabezado">
        Sistemas Operativos
      </div>
      <div className="todo">

        <Grid container >
          <Grid item md={4}>
            <div className="subtitulo">
              <h3>
                Planificación del Procesador
              </h3>
            </div>
          </Grid>
          <Grid item md={4} className="leerArchivo">
            <div className="leerArchivo">
              <Button component="label" variant="contained" startIcon={<CloudUploadOutlined />}>
                Seleccionar Archivo
                <VisuallyHiddenInput type="file" accept=".txt" onChange={cargarArchivo} />
              </Button>
            </div>
          </Grid>
          <Grid item md={2} className="sel" >
            <div className="sel">
              <TextField label="I/O" color="info" InputProps={{ style: { color: 'white' } }} type="number" id="ioField" value={io} onChange={handleIOChange} focused />
              {/* <label htmlFor="ioField">I/O: </label> <input type="number" id="ioField" value={io} onChange={handleIOChange} /> */}
            </div>
            <div className="sel">
              <TextField label="Quantum" color="info" InputProps={{ style: { color: 'white' } }} type="number" id="quantumField" value={quantum} onChange={handleQuantumChange} focused />
              {/* <label htmlFor="quantumField">Quantum: </label> <input type="number" id="quantumField" value={quantum} onChange={handleQuantumChange} /> */}
            </div>
          </Grid>
          <Grid item md={2} className="sel">
            <div className="sel">
              <TextField label="TIP" color="info" InputProps={{ style: { color: 'white' } }} type="number" id="tipField" value={tip} onChange={handleTip} focused />
              {/* <label htmlFor="tipField">TIP: </label><input type="number" id="tipField" value={tip} onChange={handleTip}/> */}
            </div>
            <div className="sel">
              <TextField label="TFP" color="info" InputProps={{ style: { color: 'white' } }} type="number" id="tfpField" value={tfp} onChange={handleTfp} focused />
              {/* <label htmlFor="tfpField">TFP: </label> <input type="number" id="tfpField" value={tfp}onChange={handleTfp} /> */}
            </div>
            <div className="sel">
              <TextField label="TCP" color="info" InputProps={{ style: { color: 'white' } }} type="number" id="tcpField" value={tcp} onChange={handleTcp} focused />
              {/* <label htmlFor="tcpField">TCP: </label> <input type="number" id="tcpField" value={tcp}onChange={handleTcp}/> */}
            </div>
          </Grid>
        </Grid>

        <Stack direction="row" spacing={10}>
          <ListItem>
            <div className="botones">
              <Button variant="contained" color="success" onClick={() => habilitarBotones("FCFS")} disabled={!habilitados.FCFS}>
                FCFS
              </Button>
            </div>
            <div className="botones">
              <Button variant="contained" color="success" onClick={() => habilitarBotones("Prioridad")} disabled={!habilitados.Prioridad}>
                Prioridad
              </Button>
            </div>
            <div className="botones">
              <Button variant="contained" color="success" onClick={() => habilitarBotones("RR")} disabled={!habilitados.RR}>
                RR
              </Button>
            </div>
            <div className="botones">
              <Button variant="contained" color="success" onClick={() => habilitarBotones("SPN")} disabled={!habilitados.SPN}>
                SPN
              </Button>
            </div>
            <div className="botones">
              <Button variant="contained" color="success" onClick={() => habilitarBotones("SRTN")} disabled={!habilitados.SRTN}>
                SRTN
              </Button>
            </div>
          </ListItem>
          <ListItem>
            <div>
              <Button component="label" variant="contained" startIcon={<AddAlarm />} onClick={avanzarTiempo} disabled={!habilitados.tiempo} size="large" color="warning">
                {count}
              </Button>
              {/* <p>TIEMPO {count}</p> */}
              {/* <button onClick={avanzarTiempo} disabled={!habilitados.tiempo}>Avanzar Tiempo</button> */}
            </div>
          </ListItem>
        </Stack>

        <Grid container>
          <Grid item p={1} m={2} alignItems="center">
            {nuevo && (
              <div>
                <Card sx={{ alignContent: "center", textAlign: "center", alignItems: "center", border: 2, borderBottom: 6, borderRight: 6, color: "white", backgroundColor: "transparent", borderColor: "#0567b7" }}>
                  <Card sx={{ color: "white", backgroundColor: "#0567b7", margin: "3px", padding: "10px" }}>
                    Nuevo: TIP={tip}
                  </Card>
                  <table>
                    <thead>
                      <tr>
                        <th>Proceso |</th>
                        <th>Arribo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nuevo.map((item, index) => (
                        <tr key={index}>
                          <td>{item.Proceso}</td>
                          <td>{item.Arribo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
            )}
          </Grid>
          <Grid item p={1} m={2} alignItems="center">
            {listo && (
              <div>
                <Card sx={{ alignContent: "center", textAlign: "center", alignItems: "center", border: 2, borderBottom: 6, borderRight: 6, color: "white", backgroundColor: "transparent", borderColor: "#0567b7" }}>
                  <Card sx={{ color: "white", backgroundColor: "#0567b7", margin: "3px", padding: "10px" }}>
                    Listo:
                  </Card>
                  <table>
                    <thead>
                      <tr>
                        <th>Proceso |</th>
                        <th>Prioridad |</th>
                        <th>Previsto |</th>
                        <th>Servicio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listo.map((item, index) => (
                        <tr key={index}>
                          <td>{item.Proceso}</td>
                          <td>{item.Prioridad}</td>
                          <td>{item.Previsto}</td>
                          <td>{item.Servicio}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
            )
            }
          </Grid>
          <Grid item p={1} m={2} alignItems="center">
            {bloqueado && (
              <div>
                <Card sx={{ alignContent: "center", textAlign: "center", alignItems: "center", border: 2, borderBottom: 6, borderRight: 6, color: "white", backgroundColor: "transparent", borderColor: "#0567b7" }}>
                  <Card sx={{ color: "white", backgroundColor: "#0567b7", margin: "3px", padding: "10px" }}>
                    Bloqueado:
                  </Card>
                  <table>
                    <thead>
                      <tr>
                        <th>Proceso |</th>
                        <th>IO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bloqueado.map((item, index) => (
                        <tr key={index}>
                          <td>{item.Proceso}</td>
                          <td>{item.IO}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
            )
            }
          </Grid>
          <Grid item p={1} m={2} alignItems="center">
            {procesar && (
              <div>
                <Card sx={{ alignContent: "center", textAlign: "center", alignItems: "center", border: 2, borderBottom: 6, borderRight: 6, color: "white", backgroundColor: "transparent", borderColor: "#0567b7" }}>
                  <Card sx={{ color: "white", backgroundColor: "#0567b7", margin: "3px", padding: "10px" }}>
                    Procesando: Q={quantumEC} TCP={tcpEP}
                  </Card>
                  <table>
                    <thead>
                      <tr>
                        <th>Proceso |</th>
                        <th>Prioridad |</th>
                        <th>Previsto |</th>
                        <th>Servicio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {procesar.map((item, index) => (
                        <tr key={index}>
                          <td>{item.Proceso}</td>
                          <td>{item.Prioridad}</td>
                          <td>{item.Previsto}</td>
                          <td>{item.Servicio}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
            )
            }
          </Grid>
          <Grid item p={1} m={2} alignItems="center">
            {desasignoRecursos && (
              <div>
                <Card sx={{ alignContent: "center", textAlign: "center", alignItems: "center", border: 2, borderBottom: 6, borderRight: 6, color: "white", backgroundColor: "transparent", borderColor: "#0567b7" }}>
                  <Card sx={{ color: "white", backgroundColor: "#0567b7", margin: "3px", padding: "10px" }}>
                    Desasigno Recursos: TFP={tfp}
                  </Card>
                  <table>
                    <thead>
                      <tr>
                        <th>Proceso |</th>
                        <th>TFP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {desasignoRecursos.map((item, index) => (
                        <tr key={index}>
                          <td>{item.Proceso}</td>
                          <td>{item.TFP}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
            )
            }
          </Grid>
        </Grid>
        <Grid container>
          <Grid item p={1} m={2} alignItems="center">
            {finalizado && (
              <div>
                <Card sx={{ alignContent: "center", textAlign: "center", alignItems: "center", border: 2, borderBottom: 6, borderRight: 6, color: "white", backgroundColor: "transparent", borderColor: "#0567b7" }}>
                  <Card sx={{ color: "white", backgroundColor: "#0567b7", margin: "3px", padding: "10px" }}>
                    Finalizado:
                  </Card>
                  <table>
                    <thead>
                      <tr>
                        <th>Proceso |</th>
                        <th>Previsto |</th>
                        <th>Previsto al Iniciar |</th>
                        <th>Arribo |</th>
                        <th>Servicio |</th>
                        <th>Servicio al Iniciar |</th>
                        <th>Prioridad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {finalizado.map((item, index) => (
                        <tr key={index}>
                          <td>{item.Proceso}</td>
                          <td>{item.Previsto}</td>
                          <td>{item.PrevistoH}</td>
                          <td>{item.Arribo}</td>
                          <td>{item.Servicio}</td>
                          <td>{item.ServicioH}</td>
                          <td>{item.Prioridad}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
            )
            }
          </Grid>
        </Grid>

        {verCalculos && (
          <div>
            <p></p>
            <Box sx={{ width: '100%' }}>
              <LinearProgress color="inherit" />
            </Box>
            <AppBar position="static" color="secondary">
              <Toolbar variant="dense">
                <Typography variant="h4" component="div">
                  Resultados
                </Typography>
              </Toolbar>
            </AppBar>
            <Box sx={{ width: '100%' }}>
              <LinearProgress color="inherit" />
            </Box>
            <Grid container >
              <Grid item md={5.5} margin="0.5%">
                <h3>Tiempo de Retorno de Cada Trabajo</h3>
                <ul>
                  {finalizado.map((item, index) => (
                    <li key={index}>
                      Proceso {item.Proceso}: {item.TR}
                    </li>
                  ))}
                </ul>


                <h3>Tiempo de Retorno Normalizado de Cada Trabajo</h3>
                <ul>
                  {finalizado.map((item, index) => (
                    <li key={index}>
                      Proceso {item.Proceso}: {item.TRN.toFixed(2)}
                    </li>
                  ))}
                </ul>
                <h3>Tiempo de Retorno de la Tanda</h3>
                <ul>
                  <li>{count}</li>
                </ul>
              </Grid>
              <Grid item md={5.5} margin="0.5%">
                <h3>Tiempo Medio de Retorno de la Tanda</h3>
                <ul>
                  <li>{TMRT}</li>
                </ul>
                <h3>Tiempo de Espera de Cada Trabajo</h3>
                <ul>
                  {finalizado.map((item, index) => (
                    <li key={index}>
                      Proceso {item.Proceso}: {item.TE}
                    </li>
                  ))}
                </ul>
                <h3>Tiempo Medio de Espera de la Tanda</h3>
                <ul>
                  <li>{TME}</li>
                </ul>
              </Grid>
            </Grid>
          </div>
        )
        }
      </div>
      <div className="pie">
        ® UNTDF - Luis Orescovich - lhorescovich@gmail.com
      </div>
    </div >
  );
}

export default App;


{/* <div>Nuevo: TIP={tip} */ }
{/* <h2>Nuevo: TIP={tip} </h2> */ }
{/* <ul> */ }
{/* {nuevo.map((item, index) => ( */ }
{/* <li key={index}> */ }
{/* Proceso {item.Proceso} Arribo {item.Arribo} */ }
{/* </li> */ }
{/* ))} */ }
{/* </ul> */ }
{/* </div> */ }


{/* <div> Listo:
                  <ul>
                    {listo.map((item, index) => (
                      <li key={index}>
                        Proceso {item.Proceso} Prioridad {item.Prioridad} Previsto {item.Previsto} Servicio {item.Servicio}
                      </li>
                    ))}
                  </ul>
                </div> */}
// <div>
//   <h2>PROCESANDO: Q={quantumEC} TCP={tcpEP}</h2>
//   <ul>
//     {procesar.map((item, index) => (
//       <li key={index}>
//         Proceso {item.Proceso} Prioridad {item.Prioridad} Previsto {item.Previsto} Servicio {item.Servicio}
//       </li>
//     ))}
//   </ul>
// </div>


// <div>
//   <h2>Desasignando Recursos: TFP={tfp}</h2>
//   <ul>
//     {desasignoRecursos.map((item, index) => (
//       <li key={index}>
//         Proceso {item.Proceso} TFP {item.TFP}
//       </li>
//     ))}
//   </ul>
// </div>

// <div>
//   <h2>Finalizado:</h2>
//   <ul>
//     {finalizado.map((item, index) => (
//       <li key={index}>
//         Proceso {item.Proceso} Previsto {item.Previsto} PrevistoAlIniciar {item.PrevistoH} Arribo {item.Arribo} Servicio {item.Servicio} ServicioAlIniciar {item.ServicioH} Prioridad {item.Prioridad}
//       </li>
//     ))}
//   </ul>
// </div>