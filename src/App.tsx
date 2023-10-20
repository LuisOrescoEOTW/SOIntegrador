import { ChangeEvent, useEffect, useState } from "react";
import "./App.css";

interface Proceso {
  Proceso: number;
  Previsto: number;
  Restante: number;
  Arribo: number;
  Servicio: number;
  IO: number;
  PrevistoH: number;
}

//HACER TODAS LAS LOGICAS JUNTAS Y LUEGO AL FINAL RECIEN ACTUALIZAR TODO!!! EN EL SET DE CADA UNO. IR TRABAJANDO CON EL CONST LOCAL PARA COORDINAR LOS DATOS.

function App() {
  const [count, setCount] = useState(-1);
  // const [nuevoInicial, setNuevoInicial] = useState<Proceso[]>([]); //El cargado sin modificar
  const [nuevo, setNuevo] = useState<Proceso[]>([]); //upNuevo
  const [listo, setListo] = useState<Proceso[]>([]); //upListo
  const [bloqueado, setBloqueado] = useState<Proceso[]>([]); //actBloqueado
  const [procesar, setProcesar] = useState<Proceso[]>([]); //actProcesar
  const [finalizado, setFinalizado] = useState<Proceso[]>([]); //upFinalizado

  const cargarArreglo = () => {
    setNuevo([
      {
        Proceso: 1,
        Previsto: 10,
        Restante: 0,
        Arribo: 0,
        Servicio: 20,
        IO: 0,
        PrevistoH: 10,
      },
      {
        Proceso: 2,
        Previsto: 20,
        Restante: 2,
        Arribo: 4,
        Servicio: 30,
        IO: 0,
        PrevistoH: 20,
      },
      {
        Proceso: 3,
        Previsto: 5,
        Restante: 0,
        Arribo: 8,
        Servicio: 15,
        IO: 0,
        PrevistoH: 5,
      },
      {
        Proceso: 4,
        Previsto: 15,
        Restante: 5,
        Arribo: 10,
        Servicio: 30,
        IO: 0,
        PrevistoH: 15,
      },
    ]);
  };

  useEffect(() => {
    cargarArreglo();
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
        //Cargo en Listo el proceso seteado con IO 25
        upListo.push({ ...value });
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
          setFinalizado((finalizado) => [...finalizado, value]);
          return false; // Elimina el elemento de nuevo
        } else {
          if (value.Previsto === 0) {
            upBloqueado.push({ ...value, Previsto: value.PrevistoH, IO: io });
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
  };
  
  // Definir un "quantum" para almacenar el valor numérico
  const [quantum, setQuantum] = useState<number>(0);
  const handleQuantumChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuantum(parseInt(event.target.value));
  };
  
  // Definir un "IO" para almacenar el valor numérico
  const [io, setIo] = useState<number>(0);
  const handleIOChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIo(parseInt(event.target.value));
  };

  return (
    <>
      <h1>- Sistemas Operativos -</h1>

      <div>
        <label htmlFor="quantumField">Quantum:  </label>
        <input
          type="number"
          id="quantumField"
          value={quantum}
          onChange={handleQuantumChange}
        />
      </div>
      <div>
        <label htmlFor="ioField">I/O:  </label>
        <input
          type="number"
          id="ioField"
          value={io}
          onChange={handleIOChange}
        />
      </div>

      <div className="card">
        <p>TIEMPO {count}</p>
        <button onClick={FCFS}>FCFS</button>
        <button onClick={RR}>Round Robin</button>
      </div>

      {nuevo && (
        <div>
          <h2>Nuevo:</h2>
          <ul>
            {nuevo.map((item, index) => (
              <li key={index}>
                Proceso {item.Proceso} Previsto {item.Previsto} Restante{" "}
                {item.Restante} Arribo {item.Arribo} Servicio {item.Servicio} IO
                {item.IO}
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
                Proceso {item.Proceso} Previsto {item.Previsto} Restante{" "}
                {item.Restante} Arribo {item.Arribo} Servicio {item.Servicio} IO
                {item.IO}
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
                Proceso {item.Proceso} Previsto {item.Previsto} Restante{" "}
                {item.Restante} Arribo {item.Arribo} Servicio {item.Servicio} IO
                {item.IO}
              </li>
            ))}
          </ul>
        </div>
      )}

      {procesar && (
        <div>
          <h2>Procesando:</h2>
          <ul>
            {procesar.map((item, index) => (
              <li key={index}>
                Proceso {item.Proceso} Previsto {item.Previsto} Restante{" "}
                {item.Restante} Arribo {item.Arribo} Servicio {item.Servicio} IO
                {item.IO}
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
                Proceso {item.Proceso} Previsto {item.Previsto} Restante
                {item.Restante} Arribo {item.Arribo} Servicio {item.Servicio} IO{" "}
                {item.IO}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default App;
