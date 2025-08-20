import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { calculateSCORE2Risk } from '../utils/score2Calculator.js'
import { TrendingDown, TrendingUp } from 'lucide-react'

const WhatIfSimulation = ({ originalParams, originalRisk }) => {
  const [simulationParams, setSimulationParams] = useState(originalParams)
  const [simulatedRisk, setSimulatedRisk] = useState(originalRisk)
  const [isNonSmoker, setIsNonSmoker] = useState(originalParams.smoking === 'non-smoker')

  // Update simulation when parameters change
  useEffect(() => {
    const newParams = {
      ...simulationParams,
      smoking: isNonSmoker ? 'non-smoker' : 'smoker'
    }
    
    try {
      const newRisk = calculateSCORE2Risk(newParams)
      setSimulatedRisk(newRisk)
    } catch (error) {
      console.error('Error calculating simulated risk:', error)
    }
  }, [simulationParams, isNonSmoker])

  const handleBPChange = (value) => {
    setSimulationParams(prev => ({
      ...prev,
      systolicBP: value[0]
    }))
  }

  const handleCholesterolChange = (value) => {
    setSimulationParams(prev => ({
      ...prev,
      totalCholesterol: value[0]
    }))
  }

  const riskDifference = simulatedRisk.riskPercentage - originalRisk.riskPercentage
  const isImprovement = riskDifference < 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>What If Simulation</span>
          {isImprovement ? (
            <TrendingDown className="h-5 w-5 text-green-500" />
          ) : (
            <TrendingUp className="h-5 w-5 text-red-500" />
          )}
        </CardTitle>
        <CardDescription>
          See how lifestyle changes could affect your cardiovascular risk
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Comparison */}
        <div className="bg-muted p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Current Risk</p>
              <p className="text-2xl font-bold">{originalRisk.riskPercentage}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Simulated Risk</p>
              <p className={`text-2xl font-bold ${isImprovement ? 'text-green-600' : 'text-red-600'}`}>
                {simulatedRisk.riskPercentage}%
              </p>
            </div>
          </div>
          <div className="mt-2 text-center">
            <p className={`text-sm font-medium ${isImprovement ? 'text-green-600' : 'text-red-600'}`}>
              {isImprovement ? 'Reduction' : 'Increase'}: {Math.abs(riskDifference).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Smoking Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="smoking-switch">Non-smoker</Label>
            <Switch
              id="smoking-switch"
              checked={isNonSmoker}
              onCheckedChange={setIsNonSmoker}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {isNonSmoker ? 'Simulating as non-smoker' : 'Simulating as smoker'}
          </p>
        </div>

        {/* Blood Pressure Slider */}
        <div className="space-y-2">
          <Label>Systolic Blood Pressure: {simulationParams.systolicBP} mmHg</Label>
          <Slider
            value={[simulationParams.systolicBP]}
            onValueChange={handleBPChange}
            max={200}
            min={90}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>90 mmHg</span>
            <span>200 mmHg</span>
          </div>
        </div>

        {/* Cholesterol Slider */}
        <div className="space-y-2">
          <Label>Total Cholesterol: {simulationParams.totalCholesterol} mmol/L</Label>
          <Slider
            value={[simulationParams.totalCholesterol]}
            onValueChange={handleCholesterolChange}
            max={10}
            min={3}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>3.0 mmol/L</span>
            <span>10.0 mmol/L</span>
          </div>
        </div>

        {/* Recommendations based on simulation */}
        {isImprovement && (
          <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>Great news!</strong> These changes could reduce your cardiovascular risk by {Math.abs(riskDifference).toFixed(1)}%. 
              Consider discussing these targets with your healthcare provider.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default WhatIfSimulation

