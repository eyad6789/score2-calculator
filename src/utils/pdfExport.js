// PDF Export Utility for SCORE2 Risk Assessment Reports
// This is a simplified implementation - in a production environment,
// you would use libraries like jsPDF or react-pdf

export function generatePDFReport(formData, results) {
  // Create a comprehensive report object
  const report = {
    title: 'SCORE2 Cardiovascular Risk Assessment Report',
    date: new Date().toLocaleDateString(),
    patientInfo: {
      age: formData.age,
      sex: formData.sex,
      region: formData.region,
      smoking: formData.smoking,
      systolicBP: formData.systolicBP,
      totalCholesterol: formData.totalCholesterol,
      cholesterolUnit: formData.cholesterolUnit,
      hdlCholesterol: formData.hdlCholesterol || 'Not provided',
      diabetes: formData.diabetes || 'Not specified',
      bmi: formData.bmi || 'Not provided'
    },
    results: {
      riskPercentage: results.riskPercentage,
      riskCategory: results.riskCategory,
      heartAge: results.heartAge,
      algorithm: results.algorithm,
      interpretation: results.interpretation,
      recommendations: results.recommendations
    }
  }

  // Generate HTML content for the report
  const htmlContent = generateReportHTML(report)
  
  // Create a downloadable HTML file (simplified approach)
  // In production, you would use a proper PDF generation library
  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  
  // Create download link
  const link = document.createElement('a')
  link.href = url
  link.download = `SCORE2_Risk_Report_${new Date().toISOString().split('T')[0]}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up
  URL.revokeObjectURL(url)
}

function generateReportHTML(report) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${report.title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #e5e5e5;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #dc2626;
            margin: 0;
        }
        .header p {
            color: #666;
            margin: 5px 0;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            color: #1f2937;
            border-bottom: 1px solid #e5e5e5;
            padding-bottom: 10px;
        }
        .risk-result {
            background: #f9fafb;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
        }
        .risk-percentage {
            font-size: 3em;
            font-weight: bold;
            color: #dc2626;
            margin: 0;
        }
        .risk-category {
            font-size: 1.2em;
            font-weight: bold;
            margin: 10px 0;
            padding: 8px 16px;
            border-radius: 20px;
            display: inline-block;
        }
        .risk-low { background: #dcfce7; color: #166534; }
        .risk-moderate { background: #fef3c7; color: #92400e; }
        .risk-high { background: #fed7aa; color: #c2410c; }
        .risk-very-high { background: #fecaca; color: #dc2626; }
        .patient-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
        }
        .info-item {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid #e5e5e5;
        }
        .info-label {
            font-weight: bold;
        }
        .recommendations {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            padding: 20px;
        }
        .recommendations ul {
            margin: 0;
            padding-left: 20px;
        }
        .recommendations li {
            margin-bottom: 10px;
        }
        .disclaimer {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin-top: 30px;
        }
        .disclaimer strong {
            color: #92400e;
        }
        @media print {
            body { margin: 0; }
            .header { page-break-after: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${report.title}</h1>
        <p>Generated on: ${report.date}</p>
        <p>Algorithm: ${report.results.algorithm}</p>
    </div>

    <div class="section">
        <h2>Risk Assessment Results</h2>
        <div class="risk-result">
            <p class="risk-percentage">${report.results.riskPercentage}%</p>
            <div class="risk-category risk-${report.results.riskCategory}">
                ${report.results.riskCategory.charAt(0).toUpperCase() + report.results.riskCategory.slice(1)} Risk
            </div>
            <p style="margin-top: 15px; font-style: italic;">
                ${report.results.interpretation}
            </p>
            <p><strong>Heart Age:</strong> ${report.results.heartAge} years</p>
        </div>
    </div>

    <div class="section">
        <h2>Patient Information</h2>
        <div class="patient-info">
            <div class="info-item">
                <span class="info-label">Age:</span>
                <span>${report.patientInfo.age} years</span>
            </div>
            <div class="info-item">
                <span class="info-label">Sex:</span>
                <span>${report.patientInfo.sex.charAt(0).toUpperCase() + report.patientInfo.sex.slice(1)}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Risk Region:</span>
                <span>${report.patientInfo.region.charAt(0).toUpperCase() + report.patientInfo.region.slice(1)}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Smoking Status:</span>
                <span>${report.patientInfo.smoking.charAt(0).toUpperCase() + report.patientInfo.smoking.slice(1)}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Systolic BP:</span>
                <span>${report.patientInfo.systolicBP} mmHg</span>
            </div>
            <div class="info-item">
                <span class="info-label">Total Cholesterol:</span>
                <span>${report.patientInfo.totalCholesterol} ${report.patientInfo.cholesterolUnit}</span>
            </div>
            <div class="info-item">
                <span class="info-label">HDL Cholesterol:</span>
                <span>${report.patientInfo.hdlCholesterol} ${report.patientInfo.cholesterolUnit}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Diabetes:</span>
                <span>${report.patientInfo.diabetes}</span>
            </div>
            <div class="info-item">
                <span class="info-label">BMI:</span>
                <span>${report.patientInfo.bmi} kg/m²</span>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Personalized Recommendations</h2>
        <div class="recommendations">
            <ul>
                ${report.results.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
    </div>

    <div class="disclaimer">
        <strong>Medical Disclaimer:</strong> This tool is for educational purposes only. 
        It does not replace medical advice. Please consult your doctor before making health decisions.
        The SCORE2 algorithm is based on the 2021 ESC Guidelines for cardiovascular disease prevention.
    </div>
</body>
</html>
  `
}

export function shareResults(formData, results) {
  // Generate a shareable summary
  const summary = `SCORE2 Cardiovascular Risk Assessment
  
Risk: ${results.riskPercentage}% (${results.riskCategory} risk)
Heart Age: ${results.heartAge} years
Algorithm: ${results.algorithm}

${results.interpretation}

Generated by SCORE2 Risk Calculator
Date: ${new Date().toLocaleDateString()}`

  // Use Web Share API if available, otherwise copy to clipboard
  if (navigator.share) {
    navigator.share({
      title: 'SCORE2 Risk Assessment Results',
      text: summary
    }).catch(err => {
      console.log('Error sharing:', err)
      copyToClipboard(summary)
    })
  } else {
    copyToClipboard(summary)
  }
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Results copied to clipboard!')
    }).catch(err => {
      console.error('Failed to copy:', err)
      fallbackCopyToClipboard(text)
    })
  } else {
    fallbackCopyToClipboard(text)
  }
}

function fallbackCopyToClipboard(text) {
  const textArea = document.createElement('textarea')
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  
  try {
    document.execCommand('copy')
    alert('Results copied to clipboard!')
  } catch (err) {
    console.error('Fallback copy failed:', err)
    alert('Unable to copy results. Please copy manually.')
  }
  
  document.body.removeChild(textArea)
}

