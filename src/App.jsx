import React, { useState, useEffect } from 'react'
import './App.css'
import { io } from 'socket.io-client'
import Icon from '@mdi/react'
import { mdiContentSaveAll, mdiHistory, mdiSineWave } from '@mdi/js'
import PowerTriangleChart from './components/chart'
import { HistoryMetering } from './components/HistoryMetering'
import 'react-toastify/dist/ReactToastify.css'
import 'leaflet/dist/leaflet.css'
import { toast, ToastContainer } from 'react-toastify'

const socket = io(import.meta.env.VITE_SOCKET_URL)
function App () {
  // const [data, setData] = useState(null)
  const [data, setData] = useState({
    potenciaP: 150,
    reactivaQ: 20,
    aparenteS: 107.703,
    factorPotencia: 1
  })
  const [timeoutId, setTimeoutId] = useState(null)
  const [meteringView, setMeteringView] = useState(true)
  const [location, setLocation] = useState({ latitude: null, longitude: null })
  useEffect(() => {
    socket.on('data', (newData) => {
      setData(newData)

      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      const newTimeoutId = setTimeout(() => {
        setData(null)
      }, 40000)
      setTimeoutId(newTimeoutId)
    })

    return () => {
      socket.off('data')
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])
  const renderData = () => {
    console.log(data)
    if (data) {
      try {
        return (
          <div className='metering'>
            <h3>Medicion en curso</h3>
            <div className='data'>
              <div className='info'>
                <p>Potencia P: {data.potenciaP} W</p>
                <p>Reactiva Q: {data.reactivaQ} VA</p>
                <p>Aparente S: {data.aparenteS} VAR</p>
                <p>Factor de potencia: {data.factorPotencia}</p>
              </div>
              <div className='grafica'>
                <PowerTriangleChart
                  activa={data.potenciaP}
                  reactiva={data.reactivaQ}
                />
              </div>
            </div>
            <button onClick={handleSaveMettering}><Icon path={mdiContentSaveAll} size={1} /></button>
          </div>
        )
      } catch (e) {
        console.error('Error parsing JSON:', e)
        return <p>Error en conversion de datos</p>
      }
    }
    return <p>No hay una medición en curso</p>
  }
  const historialClick = () => {
    setMeteringView(false)
  }

  const meteringClick = () => {
    setMeteringView(true)
  }

  const handleSaveMettering = async () => {
    const getLocation = () => {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              })
            },
            (error) => {
              reject(error)
            }
          )
        } else {
          reject(new Error('Geolocation not supported'))
        }
      })
    }
    try {
      // Obtener la ubicación
      const ubicacion = await getLocation()
      setLocation(ubicacion)
      console.log(location)
      // Obtener la fecha y hora actuales
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      const year = now.getFullYear() // Obtiene el año completo (YYYY)
      const month = String(now.getMonth() + 1).padStart(2, '0') // Obtiene el mes (1-12), añadiendo 1 porque getMonth() es 0-indexado
      const day = String(now.getDate()).padStart(2, '0')

      // Crear los datos a enviar
      const dataToSend = {
        activa: data.potenciaP,
        reactiva: data.reactivaQ,
        aparente: data.aparenteS,
        fp: data.factorPotencia,
        hora: `${hours}:${minutes}:${seconds}`,
        fecha: `${year}-${month}-${day}`,
        latitude: location.latitude,
        longitude: location.longitude
      }
      // Enviar informacion
      const res = await fetch(import.meta.env.VITE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      })

      if (!res.ok) {
        throw new Error('Network response was not ok')
      }
      toast.success('¡Datos guardados exitosamente!')
    } catch (error) {
      toast.error(`Error al guardar los datos: ${error.message}`)
    }
  }
  return (
    <>
      <div className='header'>
        <h1>Lifae Medicion de potencia IOT - lifae</h1>
        <div className='header__buttons'>
          <button onClick={historialClick}><Icon path={mdiHistory} size={1} /> Historial</button>
          <button onClick={meteringClick}><Icon path={mdiSineWave} size={1} />Medición</button>
        </div>
        <ToastContainer />
      </div>
      {meteringView
        ? (
          <p>{renderData()}</p>
          )
        : (
          <HistoryMetering />
          )}

    </>
  )
}

export default App
