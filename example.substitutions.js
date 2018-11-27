const askQuestion = require('./substitutionHelpers')

module.exports = {
  'Your name': 'John Smith',
  'Name of Deceased': (data) => {
    const { MI } = data
    return `${data['First Name']} ${MI ? `${MI} ` : ''}${data['Last Name']}`
  },
  'Sex': (data) => {
    const { MI } = data
    const name = `${data['First Name']} ${MI ? `${MI} ` : ''}${data['Last Name']}`
    return askQuestion(`What is ${name}'s sex?`, ['Male', 'Female'])
  },
  'Amount of Time at Institution': (data) => data['Time in Institution'],
  'Additional Ailments': (data) => data['Other Ailments'],
  'Autopsy': (data) => {
    switch (data['Autopsy']) {
      case 'Y':
        return 'Yes'
      case 'N':
        return 'No'
      default:
        return 'Unknown'
    }
  },
  "Mother's Birth Location": (data) => data["Mother's Birthplace"],
  "Father's Birth Location": (data) => data["Father's Birthplace"],
  'Marital Status': (data) => {
    if (data['Marital Status'] === '') return 'Single'
    return askQuestion(`What is the Marital Status: ${data['Marital Status']}`, ['Single', 'Married', 'Divorced', 'Widowed'])
  },
  'Name of Spouse': (data) => {
    if (data['Marital Status'] === '') return ''
    return askQuestion(`What is the name of their spouse: ${data['Marital Status']}`)
  },
  'Race': (data) => data['Racial Description'],
  'Additional Information': ''
}
