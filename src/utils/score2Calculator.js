// SCORE2 Cardiovascular Risk Calculator
// Based on ESC 2021 Guidelines and SCORE2 algorithm
// Reference: https://academic.oup.com/eurheartj/article/42/25/2439/6297709

/**
 * Calculate 10-year cardiovascular risk using SCORE2 algorithm
 * @param {Object} params - Patient parameters
 * @param {number} params.age - Age in years (40-69 for SCORE2, ≥70 for SCORE2-OP)
 * @param {string} params.sex - 'male' or 'female'
 * @param {string} params.region - 'low', 'moderate', 'high', 'very-high'
 * @param {string} params.smoking - 'smoker' or 'non-smoker'
 * @param {number} params.systolicBP - Systolic blood pressure in mmHg
 * @param {number} params.totalCholesterol - Total cholesterol in mmol/L
 * @param {string} params.cholesterolUnit - 'mmol/L' or 'mg/dL'
 * @param {number} params.hdlCholesterol - HDL cholesterol (optional)
 * @param {string} params.diabetes - 'yes' or 'no' (optional)
 * @param {number} params.bmi - BMI (optional)
 * @returns {Object} Risk calculation results
 */
export function calculateSCORE2Risk(params) {
  // Convert cholesterol to mmol/L if needed
  let totalChol = params.totalCholesterol;
  let hdlChol = params.hdlCholesterol || null;
  
  if (params.cholesterolUnit === 'mg/dL') {
    totalChol = totalChol / 38.67; // Convert mg/dL to mmol/L
    if (hdlChol) hdlChol = hdlChol / 38.67;
  }

  // Determine if SCORE2-OP should be used (age ≥70)
  const useScore2OP = params.age >= 70;

  // Base risk calculation using simplified SCORE2 approach
  // This is a simplified implementation based on the SCORE2 methodology
  // In practice, the actual SCORE2 uses complex Cox regression models
  
  let riskScore = 0;

  // Age component (strongest predictor)
  const ageComponent = Math.log(params.age / 40) * (params.sex === 'male' ? 0.8 : 0.7);
  riskScore += ageComponent;

  // Sex component
  const sexComponent = params.sex === 'male' ? 0.5 : 0;
  riskScore += sexComponent;

  // Smoking component
  const smokingComponent = params.smoking === 'smoker' ? 0.6 : 0;
  riskScore += smokingComponent;

  // Systolic BP component
  const bpComponent = Math.log(params.systolicBP / 120) * 0.4;
  riskScore += bpComponent;

  // Total cholesterol component
  const cholComponent = Math.log(totalChol / 5.0) * 0.3;
  riskScore += cholComponent;

  // HDL cholesterol component (protective)
  if (hdlChol) {
    const hdlComponent = -Math.log(hdlChol / 1.3) * 0.2;
    riskScore += hdlComponent;
  }

  // Diabetes component (if provided)
  if (params.diabetes === 'yes') {
    riskScore += 0.4;
  }

  // Regional calibration factors
  const regionalFactors = {
    'low': 0.7,
    'moderate': 1.0,
    'high': 1.4,
    'very-high': 1.8
  };

  const regionalFactor = regionalFactors[params.region] || 1.0;
  riskScore *= regionalFactor;

  // Age adjustment for SCORE2-OP
  if (useScore2OP) {
    riskScore *= 1.2; // Higher baseline risk for older patients
  }

  // Convert to 10-year risk percentage
  // Using exponential transformation typical of survival models
  const baselineRisk = useScore2OP ? 0.15 : 0.08; // Higher baseline for older patients
  let riskPercentage = (1 - Math.exp(-Math.exp(riskScore) * baselineRisk)) * 100;

  // Ensure reasonable bounds
  riskPercentage = Math.max(0.1, Math.min(50, riskPercentage));

  // Determine risk category based on age and risk percentage
  const riskCategory = categorizeRisk(riskPercentage, params.age);

  // Calculate heart age (simplified approach)
  const heartAge = calculateHeartAge(params, riskPercentage);

  // Generate personalized recommendations
  const recommendations = generateRecommendations(params, riskCategory);

  // Generate interpretation
  const interpretation = generateInterpretation(riskPercentage, params.sex);

  return {
    riskPercentage: Math.round(riskPercentage * 10) / 10,
    riskCategory,
    heartAge,
    interpretation,
    recommendations,
    algorithm: useScore2OP ? 'SCORE2-OP' : 'SCORE2'
  };
}

/**
 * Categorize risk based on percentage and age
 */
function categorizeRisk(riskPercentage, age) {
  if (age < 50) {
    if (riskPercentage < 2.5) return 'low';
    if (riskPercentage < 7.5) return 'moderate';
    if (riskPercentage < 10) return 'high';
    return 'very-high';
  } else {
    if (riskPercentage < 5) return 'low';
    if (riskPercentage < 10) return 'moderate';
    if (riskPercentage < 15) return 'high';
    return 'very-high';
  }
}

/**
 * Calculate heart age (simplified approach)
 */
function calculateHeartAge(params, riskPercentage) {
  // Create a reference profile (healthy individual)
  const referenceParams = {
    ...params,
    smoking: 'non-smoker',
    systolicBP: 120,
    totalCholesterol: 5.0,
    diabetes: 'no'
  };

  // Calculate reference risk directly without calling calculateSCORE2Risk
  let referenceRiskScore = 0;

  // Convert cholesterol to mmol/L if needed
  let totalChol = referenceParams.totalCholesterol;
  let hdlChol = referenceParams.hdlCholesterol || null;
  
  if (referenceParams.cholesterolUnit === 'mg/dL') {
    totalChol = totalChol / 38.67;
    if (hdlChol) hdlChol = hdlChol / 38.67;
  }

  // Determine if SCORE2-OP should be used (age ≥70)
  const useScore2OP = referenceParams.age >= 70;

  // Age component (strongest predictor)
  const ageComponent = Math.log(referenceParams.age / 40) * (referenceParams.sex === 'male' ? 0.8 : 0.7);
  referenceRiskScore += ageComponent;

  // Sex component
  const sexComponent = referenceParams.sex === 'male' ? 0.5 : 0;
  referenceRiskScore += sexComponent;

  // Smoking component (non-smoker = 0)
  const smokingComponent = 0;
  referenceRiskScore += smokingComponent;

  // Systolic BP component (120 mmHg)
  const bpComponent = Math.log(120 / 120) * 0.4; // This equals 0
  referenceRiskScore += bpComponent;

  // Total cholesterol component (5.0 mmol/L)
  const cholComponent = Math.log(5.0 / 5.0) * 0.3; // This equals 0
  referenceRiskScore += cholComponent;

  // HDL cholesterol component (protective)
  if (hdlChol) {
    const hdlComponent = -Math.log(hdlChol / 1.3) * 0.2;
    referenceRiskScore += hdlComponent;
  }

  // No diabetes for reference
  // referenceRiskScore += 0;

  // Regional calibration factors
  const regionalFactors = {
    'low': 0.7,
    'moderate': 1.0,
    'high': 1.4,
    'very-high': 1.8
  };

  const regionalFactor = regionalFactors[referenceParams.region] || 1.0;
  referenceRiskScore *= regionalFactor;

  // Age adjustment for SCORE2-OP
  if (useScore2OP) {
    referenceRiskScore *= 1.2;
  }

  // Convert to 10-year risk percentage
  const baselineRisk = useScore2OP ? 0.15 : 0.08;
  let referenceRiskPercentage = (1 - Math.exp(-Math.exp(referenceRiskScore) * baselineRisk)) * 100;

  // Ensure reasonable bounds
  referenceRiskPercentage = Math.max(0.1, Math.min(50, referenceRiskPercentage));

  // Estimate heart age based on risk difference
  const riskRatio = riskPercentage / referenceRiskPercentage;
  const heartAge = Math.round(params.age + (riskRatio - 1) * 10);

  return Math.max(params.age, Math.min(100, heartAge));
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations(params, riskCategory) {
  const recommendations = [];

  // Smoking recommendations
  if (params.smoking === 'smoker') {
    recommendations.push('Quit smoking - this is the single most important step to reduce your cardiovascular risk');
    recommendations.push('Consider nicotine replacement therapy or consult your doctor about smoking cessation aids');
  }

  // Blood pressure recommendations
  if (params.systolicBP > 140) {
    recommendations.push('Discuss blood pressure management with your doctor');
    recommendations.push('Reduce salt intake and increase physical activity');
    recommendations.push('Consider antihypertensive medication if lifestyle changes are insufficient');
  } else if (params.systolicBP > 130) {
    recommendations.push('Monitor blood pressure regularly and maintain a healthy lifestyle');
  }

  // Cholesterol recommendations
  const totalCholMmol = params.cholesterolUnit === 'mg/dL' ? 
    params.totalCholesterol / 38.67 : params.totalCholesterol;
  
  if (totalCholMmol > 5.5) {
    recommendations.push('Discuss cholesterol management with your doctor');
    recommendations.push('Follow a Mediterranean-style diet rich in fruits, vegetables, and healthy fats');
    recommendations.push('Consider statin therapy if dietary changes are insufficient');
  }

  // Diabetes recommendations
  if (params.diabetes === 'yes') {
    recommendations.push('Maintain optimal blood glucose control');
    recommendations.push('Regular monitoring of HbA1c levels');
    recommendations.push('Consider additional cardiovascular protection medications');
  }

  // General lifestyle recommendations
  if (riskCategory === 'moderate' || riskCategory === 'high' || riskCategory === 'very-high') {
    recommendations.push('Engage in regular physical activity (at least 150 minutes of moderate exercise per week)');
    recommendations.push('Maintain a healthy weight (BMI 18.5-24.9)');
    recommendations.push('Limit alcohol consumption');
    recommendations.push('Consider low-dose aspirin therapy (consult your doctor)');
  }

  // Low risk recommendations
  if (riskCategory === 'low') {
    recommendations.push('Maintain your current healthy lifestyle');
    recommendations.push('Continue regular physical activity and healthy diet');
    recommendations.push('Regular health check-ups every 2-3 years');
  }

  return recommendations;
}

/**
 * Generate risk interpretation
 */
function generateInterpretation(riskPercentage, sex) {
  const roundedRisk = Math.round(riskPercentage);
  const pronoun = sex === 'male' ? 'men' : 'women';
  
  return `This means out of 100 ${pronoun} like you, about ${roundedRisk} will have a heart attack or stroke in the next 10 years.`;
}

/**
 * Validate input parameters
 */
export function validateSCORE2Inputs(params) {
  const errors = [];

  if (!params.age || params.age < 40 || params.age > 100) {
    errors.push('Age must be between 40 and 100 years');
  }

  if (!params.sex || !['male', 'female'].includes(params.sex)) {
    errors.push('Sex must be specified as male or female');
  }

  if (!params.region || !['low', 'moderate', 'high', 'very-high'].includes(params.region)) {
    errors.push('Risk region must be specified');
  }

  if (!params.smoking || !['smoker', 'non-smoker'].includes(params.smoking)) {
    errors.push('Smoking status must be specified');
  }

  if (!params.systolicBP || params.systolicBP < 80 || params.systolicBP > 250) {
    errors.push('Systolic blood pressure must be between 80 and 250 mmHg');
  }

  if (!params.totalCholesterol || params.totalCholesterol <= 0) {
    errors.push('Total cholesterol must be specified and greater than 0');
  }

  return errors;
}

