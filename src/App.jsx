import React, { useState, useEffect } from 'react'
import './App.css'
import { io } from 'socket.io-client'
import Icon from '@mdi/react'
import { mdiContentSaveAll, mdiHistory, mdiSineWave } from '@mdi/js'
import PowerTriangleChart from './components/chart'
const socket = io('http://192.168.1.15:8081')
function App () {
  // const [data, setData] = useState(null)
  const [data, setData] = useState({
    potenciaP: 150,
    reactivaQ: 20,
    aparenteS: 107.703,
    factorPotencia: 1
  })

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
                <PowerTriangleChart data={data} />
              </div>
            </div>
            <button><Icon path={mdiContentSaveAll} size={1} /></button>
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
      <div className='header'>
        <h1>Lifae Medicion de potencia IOT - lifae</h1>
        <div className='header__buttons'>
          <button><Icon path={mdiHistory} size={1} /> Historial</button>
          <button><Icon path={mdiSineWave} size={1} />Medición</button>
        </div>
      </div>
      <p>{renderData()}</p>
    </>
  )
}

export default App
