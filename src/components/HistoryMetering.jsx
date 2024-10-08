import React, { useState, useEffect } from 'react'
import { Table, Button } from 'react-bootstrap'
import Icon from '@mdi/react'
import { mdiEye } from '@mdi/js'
import PowerTriangleChart from './chart'
import { MapMetering } from './MapMetering'
// import 'bootstrap/dist/css/bootstrap.min.css'
export const HistoryMetering = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMetering, setSelectedMetering] = useState(null)
  useEffect(() => {
    fetch(import.meta.env.VITE_API_HISTORIC)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error en la solicitud')
        }
        return response.json()
      })
      .then((data) => {
        setData(data)
        setLoading(false)
      })
      .catch((error) => {
        setError(error)
        setLoading(false)
      })
  }, [])
  if (loading) {
    return <p>Cargando...</p>
  }
  if (error) {
    return <p>Error: {error.message}</p>
  }

  const handleShowDetails = (dato) => {
    setSelectedMetering(dato)
  }

  const handleCloseModal = () => {
    setSelectedMetering(null)
  }
  return (
    <>
      <Table responsive='sm' bordered>
        <thead>
          <tr>
            <th>Activa</th>
            <th>Reactiva</th>
            <th>Aparente</th>
            <th>FP</th>
            <th>Fecha</th>
            <th>Detalles</th>
          </tr>
        </thead>
        <tbody>
          {data.map((dato) => (
            <tr key={dato.id}>
              <td>{dato.activa}</td>
              <td>{dato.reactiva}</td>
              <td>{dato.aparente}</td>
              <td>{dato.fp}</td>
              <td>{dato.fecha}</td>
              <td>
                <Button variant='primary' onClick={() => handleShowDetails(dato)}>
                  <Icon path={mdiEye} size={1} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedMetering && (
        <div className='custom-modal-overlay'>
          <div className='custom-modal'>
            <div className='custom-modal-header'>
              <h2>Detalles de la Medición</h2>
              <button className='custom-close-button' onClick={handleCloseModal}>×</button>
            </div>
            <div className='custom-modal-body'>
              <div className='custom-modal-body-info'>
                <p><strong>Activa:</strong> {selectedMetering.activa} W</p>
                <p><strong>Reactiva:</strong> {selectedMetering.reactiva} VAR</p>
                <p><strong>Aparente:</strong> {selectedMetering.aparente} VA</p>
                <p><strong>FP:</strong> {selectedMetering.fp}</p>
                <p><strong>Hora:</strong> {selectedMetering.hora}</p>
                <p><strong>Fecha:</strong> {selectedMetering.fecha}</p>
              </div>
              <div className='custom-modal-body-grafica'>
                <PowerTriangleChart
                  activa={selectedMetering.activa}
                  reactiva={selectedMetering.reactiva}
                />
              </div>
            </div>
            {(selectedMetering.latitude != null && selectedMetering.longitude != null)
              ? (
                <div className='custom-modal-map'>
                  <MapMetering latitude={selectedMetering.latitude} longitude={selectedMetering.longitude} />
                </div>
                )
              : (
                <div className='custom-modal-map'>
                  <p>No hay ubicación disponible</p>
                </div>
                )}
          </div>
        </div>
      )}
    </>
  )
}
