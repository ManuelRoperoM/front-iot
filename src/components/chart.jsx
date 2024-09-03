import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts'
const PowerTriangleChart = ({ activa, reactiva }) => {
//   const { potenciaP, reactivaQ } = data
//   console.log(data)
  // Calcula los puntos del triángulo
  const puntos = [
    { name: 'P', x: 0, y: 0 },
    { name: 'Q', x: activa, y: reactiva }
  ]

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart data={puntos} margin={{ top: 30, right: 20, left: 0, bottom: 12 }}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis
          dataKey='x'
          domain={[0, 'dataMax']}
          tickFormatter={(value) => `${value} W`}

        >
          <Label value='Potencia(P)' offset={-10} position='insideBottomRight' />
        </XAxis>
        <YAxis
          domain={[0, 'dataMax']}
          tickFormatter={(value) => `${value} VA`}
        >
          <Label value='Reactiva(Q)' offset={-25} position='insideTopRight' angle={0} />
        </YAxis>
        <Tooltip />
        <Line
          type='linear'
          dataKey='y'
          stroke='#8884d8'
          strokeWidth={2.5}
          dot={false}
          connectNulls // Conecta los puntos sin importar valores nulos
        />
      </LineChart>

    </ResponsiveContainer>
  )
}

export default PowerTriangleChart
