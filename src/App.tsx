import { useEffect, useState } from "react";
import "./App.css";

interface Proceso {
  Proceso: number;
  Previsto: number;
  Restante: number;
  Arribo: number;
  Servicio: number;
  IO: number;
}

function App() {
  const [count, setCount] = useState(-1);
  const [nuevoInicial, setNuevoInicial] = useState<Proceso[]>([]); //El cargado sin modificar
  const [nuevo, setNuevo] = useState<Proceso[]>([]); //Se va modificando
  const [listo, setListo] = useState<Proceso[]>([]);
  const [bloqueado, setBloqueado] = useState<Proceso[]>([]);
  const [procesar, setProcesar] = useState<Proceso[]>([]);
  const [finalizado, setFinalizado] = useState<Proceso[]>([]);

  const GestionListo = () => {
    const nuevoActualizado = nuevo.filter((value) => {
      if (value.Arribo === count + 1) {
        setListo((listo) => [...listo, value]);
        return false; // Elimina el elemento de nuevo
      }
      return true; // Mantiene el elemento en nuevo
    });
    setNuevo(nuevoActualizado);
  };

  const GestionBloqueado = () => {
    //Disminuye en 1 el IO de todos los bloqueados
    const updatedBloqueado = bloqueado.map((value) => {
      return { ...value, IO: value.IO - 1 };
    });
    setBloqueado(updatedBloqueado);
    //Quita de la lista de bloqueados ya agrega en Listos
    const nuevoBloqueado = bloqueado.filter((value) => {
      if (value.IO === 0) {
        //Cargo en Listo el proceso seteado con IO 25
        const valueModif = {...value, IO: 25}
        setListo((listo) => [...listo, valueModif]); 
        return false; // Elimina el elemento de nuevo
      }
      return true; // Mantiene el elemento en nuevo
    });
    setBloqueado(nuevoBloqueado);
  };

  const GestionProcesar = () => {
    //Disminuye el tiempo procesado
    const updatedProcesar = procesar.map((value) => {
      return { ...value, Previsto: value.Previsto - 1, Servicio: value.Servicio - 1 };
    });
    setProcesar(updatedProcesar);


    //Quita de la lista los procesados finalizados
    const nuevoProcesar = procesar.filter((value) => {
      if (value.Servicio === 0) {
        setFinalizado((finalizado) => [...finalizado, value]); 
        return false; // Elimina el elemento de nuevo
      }
      return true; // Mantiene el elemento en nuevo
    });
    setBloqueado(nuevoProcesar);
  };

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
      { Proceso: 1, Previsto: 10, Restante: 0, Arribo: 0, Servicio: 20, IO: 25 },
      { Proceso: 2, Previsto: 20, Restante: 2, Arribo: 4, Servicio: 30, IO: 25 },
      { Proceso: 3, Previsto: 5, Restante: 0, Arribo: 8, Servicio: 15, IO: 25 },
      { Proceso: 4, Previsto: 15, Restante: 5, Arribo: 10, Servicio: 30, IO: 25 },
    ]);
    setNuevoInicial(nuevo);
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
                Proceso {item.Proceso} Previsto {item.Previsto} Restante{" "}
                {item.Restante} Arribo {item.Arribo} Servicio {item.Servicio}
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
                {item.Restante} Arribo {item.Arribo} Servicio {item.Servicio}
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
                {item.Restante} Arribo {item.Arribo} Servicio {item.Servicio}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default App;
