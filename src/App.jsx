import React, { useState, useEffect } from 'react'
import './App.css'
import { io } from 'socket.io-client'

const socket = io('https://lifae-iot.onrender.com')
function App () {
  const [data, setData] = useState(null)
  const [timeoutId, setTimeoutId] = useState(null)
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
          <div>
            <h3>Medicion en curso</h3>
            <p>Potencia P: {data.potenciaP}</p>
            <p>Reactiva Q: {data.reactivaQ}</p>
            <p>Aparente S: {data.aparenteS}</p>
            <p>Factor de potencia: {data.factorPotencia}</p>
          </div>
        )
      } catch (e) {
        console.error('Error parsing JSON:', e)
        return <p>Error en conversion de datos</p>
      }
    }
    return <p>No hay una medición en curso</p>
  }
  return (
    <>
      <h1>Lifae Medicion de potencia IOT - lifae</h1>
      <p>{renderData()}</p>
    </>
  )
}

export default App
