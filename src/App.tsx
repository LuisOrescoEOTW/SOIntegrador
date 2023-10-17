import { useEffect, useState } from "react";
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
  const [nuevo, setNuevo] = useState<Proceso[]>([]); //Se va modificando
  const [listo, setListo] = useState<Proceso[]>([]);
  const [bloqueado, setBloqueado] = useState<Proceso[]>([]);
  const [procesar, setProcesar] = useState<Proceso[]>([]);
  const [finalizado, setFinalizado] = useState<Proceso[]>([]);

  const GestionListo =  () => {
    const nuevoActualizado = nuevo.filter((value) => {
      if (value.Arribo === count) {
        // const upListo = { ...value}
        setListo((listo) => [...listo, value]);
        return false; // Elimina el elemento de nuevo
      }
      return true; // Mantiene el elemento en nuevo
    });
    setNuevo(nuevoActualizado);
  };

  const GestionBloqueado = () => {
    //Disminuye en 1 el IO de todos los bloqueados
    const upBloqueado = bloqueado.map((value) => { return { ...value, IO: value.IO - 1 }; });
    //Quita de la lista de bloqueados ya agrega en Listos
    const nuevoBloqueado = upBloqueado.filter((value) => {
      if (value.IO === 0) {
        //Cargo en Listo el proceso seteado con IO 25
        const valueModif = { ...value, IO: 25 };
        setListo((listo) => [...listo, valueModif]);
        return false; // Elimina el elemento de nuevo
      }
      return true; // Mantiene el elemento en nuevo
    });
    setBloqueado(nuevoBloqueado);
  };

  const GestionProcesar = () => {
    //Disminuye el tiempo procesado en previsto como servicio
    if (procesar.length > 0) {
      // Función para disminuir en 1
      const upProcesar = procesar.map((value) => { return { ...value, Previsto: value.Previsto - 1, Servicio: value.Servicio - 1 }; });
      
      //Quita de la lista los procesados finalizados
      const nuevoProcesar = upProcesar.filter((value) => {
        if (value.Servicio === 0) {
          setFinalizado((finalizado) => [...finalizado, value]);
          return false; // Elimina el elemento de nuevo
        } else {
            if (value.Previsto === 0) {
            const valueModif = { ...value, Previsto: value.PrevistoH, IO: 25 };
            setBloqueado((bloqueado) => [...bloqueado, valueModif]);
            return false; // Elimina el elemento de nuevo
          } else {
              return true; // Mantiene el elemento en nuevo
          }
        }
      });
      setProcesar(nuevoProcesar);
    } else {
      // Verifica si procesar esta vacio y listo tiene elementos
      if (listo.length > 0) {
        setProcesar([listo[0]]); //Agrego el 1 elemento de listo a procesar
        setListo(listo.slice(1)); //Elimino el 1 elemento de listo
      }
    }

  };
  
  useEffect(() => {
    console.log(procesar);
  }, [procesar])
  
  const Procesar = () => {
    setCount((count) => count + 1);
    GestionListo();
    GestionBloqueado();
    GestionProcesar();

    // bloqueado?.map((value) => {
    //   console.log(value);
    // })
  };

  const cargarArreglo = () => {
    setNuevo([
      {
        Proceso: 1,
        Previsto: 10,
        Restante: 0,
        Arribo: 0,
        Servicio: 20,
        IO: 25,
        PrevistoH: 10,
      },
      {
        Proceso: 2,
        Previsto: 20,
        Restante: 2,
        Arribo: 4,
        Servicio: 30,
        IO: 25,
        PrevistoH: 20,
      },
      {
        Proceso: 3,
        Previsto: 5,
        Restante: 0,
        Arribo: 8,
        Servicio: 15,
        IO: 25,
        PrevistoH: 5,
      },
      {
        Proceso: 4,
        Previsto: 15,
        Restante: 5,
        Arribo: 10,
        Servicio: 30,
        IO: 25,
        PrevistoH: 15,
      },
    ]);
    // setNuevoInicial(nuevo);
  };

  useEffect(() => {
    nuevo.map((value) => console.log(value));
  }, [nuevo]);

  useEffect(() => {
    cargarArreglo();
  }, []);

  return (
    <>
      <h1>- Sistemas Operativos -</h1>
      <div className="card">
        <button onClick={Procesar}>Tiempo {count}</button>
      </div>

      {nuevo && (
        <div>
          <h2>Nuevo:</h2>
          <ul>
            {nuevo.map((item, index) => (
              <li key={index}>
                Proceso {item.Proceso} Previsto {item.Previsto} Restante {item.Restante} Arribo {item.Arribo} Servicio {item.Servicio} IO
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
                Proceso {item.Proceso} Previsto {item.Previsto} Restante {item.Restante} Arribo {item.Arribo} Servicio {item.Servicio} IO
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
                Proceso {item.Proceso} Previsto {item.Previsto} Restante {item.Restante} Arribo {item.Arribo} Servicio {item.Servicio} IO
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
                Proceso {item.Proceso} Previsto {item.Previsto} Restante {item.Restante} Arribo {item.Arribo} Servicio {item.Servicio} IO
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
                Proceso {item.Proceso} Previsto {item.Previsto} Restante{item.Restante} Arribo {item.Arribo} Servicio {item.Servicio} IO {item.IO}
              </li>
            ))}
          </ul>
        </div>
      )}


    </>
  );
}

export default App;
