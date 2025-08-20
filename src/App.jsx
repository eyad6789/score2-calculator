import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx'
import { Heart, Calculator, AlertTriangle, Moon, Sun, Download, Share2 } from 'lucide-react'
import { calculateSCORE2Risk, validateSCORE2Inputs } from './utils/score2Calculator.js'
import { generatePDFReport, shareResults } from './utils/pdfExport.js'
import RiskGauge from './components/RiskGauge.jsx'
import WhatIfSimulation from './components/WhatIfSimulation.jsx'
import './App.css'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    region: '',
    smoking: '',
    systolicBP: '',
    totalCholesterol: '',
    cholesterolUnit: 'mmol/L',
    hdlCholesterol: '',
    diabetes: '',
    bmi: ''
  })
  const [results, setResults] = useState(null)
  const [showResults, setShowResults] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculateRisk = () => {
    // Validate inputs
    const validationErrors = validateSCORE2Inputs({
      age: parseInt(formData.age),
      sex: formData.sex,
      region: formData.region,
      smoking: formData.smoking,
      systolicBP: parseFloat(formData.systolicBP),
      totalCholesterol: parseFloat(formData.totalCholesterol),
      cholesterolUnit: formData.cholesterolUnit,
      hdlCholesterol: formData.hdlCholesterol ? parseFloat(formData.hdlCholesterol) : null,
      diabetes: formData.diabetes,
      bmi: formData.bmi ? parseFloat(formData.bmi) : null
    })

    if (validationErrors.length > 0) {
      alert('Please check your inputs:\n' + validationErrors.join('\n'))
      return
    }

    // Calculate SCORE2 risk
    const riskResult = calculateSCORE2Risk({
      age: parseInt(formData.age),
      sex: formData.sex,
      region: formData.region,
      smoking: formData.smoking,
      systolicBP: parseFloat(formData.systolicBP),
      totalCholesterol: parseFloat(formData.totalCholesterol),
      cholesterolUnit: formData.cholesterolUnit,
      hdlCholesterol: formData.hdlCholesterol ? parseFloat(formData.hdlCholesterol) : null,
      diabetes: formData.diabetes,
      bmi: formData.bmi ? parseFloat(formData.bmi) : null
    })

    setResults(riskResult)
    setShowResults(true)
  }

  const resetForm = () => {
    setFormData({
      age: '',
      sex: '',
      region: '',
      smoking: '',
      systolicBP: '',
      totalCholesterol: '',
      cholesterolUnit: 'mmol/L',
      hdlCholesterol: '',
      diabetes: '',
      bmi: ''
    })
    setResults(null)
    setShowResults(false)
  }

  const handleExportPDF = () => {
    if (results) {
      generatePDFReport(formData, results)
    }
  }

  const handleShareResults = () => {
    if (results) {
      shareResults(formData, results)
    }
  }

  const isFormValid = () => {
    return formData.age && formData.sex && formData.region && 
           formData.smoking && formData.systolicBP && formData.totalCholesterol
  }

  return (
    <div className={`min-h-screen bg-background transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-red-500" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">SCORE2 Risk Calculator</h1>
                <p className="text-sm text-muted-foreground">10-Year Cardiovascular Risk Assessment</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              className="h-9 w-9"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Patient Information</span>
              </CardTitle>
              <CardDescription>
                Enter the patient's health data to calculate cardiovascular risk
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  min="40"
                  max="100"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="Enter age (40-100)"
                />
              </div>

              {/* Sex */}
              <div className="space-y-3">
                <Label>Sex</Label>
                <RadioGroup
                  value={formData.sex}
                  onValueChange={(value) => handleInputChange('sex', value)}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Region */}
              <div className="space-y-2">
                <Label htmlFor="region">Risk Region</Label>
                <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Risk Region</SelectItem>
                    <SelectItem value="moderate">Moderate Risk Region</SelectItem>
                    <SelectItem value="high">High Risk Region</SelectItem>
                    <SelectItem value="very-high">Very High Risk Region</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Smoking */}
              <div className="space-y-3">
                <Label>Smoking Status</Label>
                <RadioGroup
                  value={formData.smoking}
                  onValueChange={(value) => handleInputChange('smoking', value)}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non-smoker" id="non-smoker" />
                    <Label htmlFor="non-smoker">Non-smoker</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="smoker" id="smoker" />
                    <Label htmlFor="smoker">Smoker</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Systolic Blood Pressure */}
              <div className="space-y-2">
                <Label htmlFor="systolicBP">Systolic Blood Pressure (mmHg)</Label>
                <Input
                  id="systolicBP"
                  type="number"
                  min="80"
                  max="250"
                  value={formData.systolicBP}
                  onChange={(e) => handleInputChange('systolicBP', e.target.value)}
                  placeholder="e.g., 120"
                />
              </div>

              {/* Total Cholesterol */}
              <div className="space-y-2">
                <Label htmlFor="totalCholesterol">Total Cholesterol</Label>
                <div className="flex space-x-2">
                  <Input
                    id="totalCholesterol"
                    type="number"
                    step="0.1"
                    value={formData.totalCholesterol}
                    onChange={(e) => handleInputChange('totalCholesterol', e.target.value)}
                    placeholder={formData.cholesterolUnit === 'mmol/L' ? 'e.g., 5.2' : 'e.g., 200'}
                    className="flex-1"
                  />
                  <Select 
                    value={formData.cholesterolUnit} 
                    onValueChange={(value) => handleInputChange('cholesterolUnit', value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mmol/L">mmol/L</SelectItem>
                      <SelectItem value="mg/dL">mg/dL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Optional Fields */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-4 text-muted-foreground">Optional Information</h4>
                
                {/* HDL Cholesterol */}
                <div className="space-y-2 mb-4">
                  <Label htmlFor="hdlCholesterol">HDL Cholesterol ({formData.cholesterolUnit})</Label>
                  <Input
                    id="hdlCholesterol"
                    type="number"
                    step="0.1"
                    value={formData.hdlCholesterol}
                    onChange={(e) => handleInputChange('hdlCholesterol', e.target.value)}
                    placeholder={formData.cholesterolUnit === 'mmol/L' ? 'e.g., 1.2' : 'e.g., 45'}
                  />
                </div>

                {/* Diabetes */}
                <div className="space-y-3 mb-4">
                  <Label>Diabetes</Label>
                  <RadioGroup
                    value={formData.diabetes}
                    onValueChange={(value) => handleInputChange('diabetes', value)}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no-diabetes" />
                      <Label htmlFor="no-diabetes">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes-diabetes" />
                      <Label htmlFor="yes-diabetes">Yes</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* BMI */}
                <div className="space-y-2">
                  <Label htmlFor="bmi">BMI (kg/m²)</Label>
                  <Input
                    id="bmi"
                    type="number"
                    step="0.1"
                    value={formData.bmi}
                    onChange={(e) => handleInputChange('bmi', e.target.value)}
                    placeholder="e.g., 25.0"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button 
                  onClick={calculateRisk}
                  disabled={!isFormValid()}
                  className="flex-1"
                >
                  Calculate Risk
                </Button>
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Display */}
          <div className="space-y-6">
            {!showResults ? (
              <Card className="h-fit">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      Ready to Calculate
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Fill in the required fields and click "Calculate Risk" to see the results
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Risk Score Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">10-Year Cardiovascular Risk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RiskGauge 
                      riskPercentage={results.riskPercentage} 
                      riskCategory={results.riskCategory} 
                    />
                    <div className="text-center mt-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        results.riskCategory === 'low' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        results.riskCategory === 'moderate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        results.riskCategory === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {results.riskCategory.charAt(0).toUpperCase() + results.riskCategory.slice(1)} Risk
                      </div>
                    </div>
                    
                    {/* Export and Share Buttons */}
                    <div className="flex space-x-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleExportPDF}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleShareResults}
                        className="flex-1"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Results
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Interpretation Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5" />
                      <span>What This Means</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {results.interpretation}
                    </p>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm">
                        <strong>Heart Age:</strong> {results.heartAge} years
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {results.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* What If Simulation */}
                <WhatIfSimulation 
                  originalParams={{
                    age: parseInt(formData.age),
                    sex: formData.sex,
                    region: formData.region,
                    smoking: formData.smoking,
                    systolicBP: parseFloat(formData.systolicBP),
                    totalCholesterol: parseFloat(formData.totalCholesterol),
                    cholesterolUnit: formData.cholesterolUnit,
                    hdlCholesterol: formData.hdlCholesterol ? parseFloat(formData.hdlCholesterol) : null,
                    diabetes: formData.diabetes,
                    bmi: formData.bmi ? parseFloat(formData.bmi) : null
                  }}
                  originalRisk={results}
                />
              </>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <Card className="mt-8 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Medical Disclaimer:</strong> This tool is for educational purposes only. 
                It does not replace medical advice. Please consult your doctor before making health decisions.
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default App

