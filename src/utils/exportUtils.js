import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { format } from 'date-fns'

export const formatExpenseData = (expenses, farms) => {
  return expenses.map(expense => {
    const farm = farms.find(f => f.Id === parseInt(expense.farmId))
    return {
      ...expense,
      farmName: farm ? farm.name : 'Unknown Farm',
      formattedDate: format(new Date(expense.date), 'MMM d, yyyy'),
      formattedAmount: expense.amount.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD' 
      })
    }
  })
}

export const generateCSV = (expenses, farms) => {
  const formattedData = formatExpenseData(expenses, farms)
  
  const headers = [
    'Date',
    'Farm',
    'Category', 
    'Description',
    'Amount'
  ]
  
  const csvContent = [
    headers.join(','),
    ...formattedData.map(expense => [
      `"${expense.formattedDate}"`,
      `"${expense.farmName}"`,
      `"${expense.category}"`,
      `"${expense.description.replace(/"/g, '""')}"`,
      expense.amount
    ].join(','))
  ].join('\n')
  
  return csvContent
}

export const generatePDF = (expenses, farms) => {
  const formattedData = formatExpenseData(expenses, farms)
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(20)
  doc.text('Expense Report', 20, 20)
  
  // Summary
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalRecords = expenses.length
  
  doc.setFontSize(12)
  doc.text(`Generated: ${format(new Date(), 'MMM d, yyyy HH:mm')}`, 20, 35)
  doc.text(`Total Records: ${totalRecords}`, 20, 45)
  doc.text(`Total Amount: ${totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`, 20, 55)
  
  // Category breakdown
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {})
  
  if (Object.keys(expensesByCategory).length > 0) {
    doc.text('Expenses by Category:', 20, 70)
    let yPos = 80
    Object.entries(expensesByCategory)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, amount]) => {
        doc.text(`${category}: ${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`, 25, yPos)
        yPos += 10
      })
  }
  
  // Table
  const tableStartY = Object.keys(expensesByCategory).length > 0 ? 80 + (Object.keys(expensesByCategory).length * 10) + 20 : 80
  
  doc.autoTable({
    startY: tableStartY,
    head: [['Date', 'Farm', 'Category', 'Description', 'Amount']],
    body: formattedData
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(expense => [
        expense.formattedDate,
        expense.farmName,
        expense.category,
        expense.description,
        expense.formattedAmount
      ]),
    styles: {
      fontSize: 10,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    columnStyles: {
      4: { halign: 'right' }
    }
  })
  
  return doc
}

export const downloadFile = (content, filename, type = 'text/csv') => {
  const blob = new Blob([content], { type })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}