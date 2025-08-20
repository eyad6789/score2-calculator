import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const RiskGauge = ({ riskPercentage, riskCategory }) => {
  // Define colors for different risk categories
  const riskColors = {
    'low': '#22c55e',      // green
    'moderate': '#eab308',  // yellow
    'high': '#f97316',     // orange
    'very-high': '#ef4444' // red
  }

  // Create data for the gauge
  const gaugeData = [
    {
      name: 'Risk',
      value: riskPercentage,
      color: riskColors[riskCategory] || '#6b7280'
    },
    {
      name: 'Remaining',
      value: 100 - riskPercentage,
      color: '#f3f4f6'
    }
  ]

  // Custom label function for the center of the gauge
  const renderCustomLabel = ({ cx, cy }) => {
    return (
      <g>
        <text 
          x={cx} 
          y={cy - 10} 
          textAnchor="middle" 
          dominantBaseline="middle" 
          className="text-3xl font-bold fill-foreground"
        >
          {riskPercentage}%
        </text>
        <text 
          x={cx} 
          y={cy + 15} 
          textAnchor="middle" 
          dominantBaseline="middle" 
          className="text-sm fill-muted-foreground"
        >
          10-Year Risk
        </text>
      </g>
    )
  }

  return (
    <div className="w-full h-64 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={gaugeData}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
          >
            {gaugeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RiskGauge

