const AWS = require('aws-sdk')

// Create the IAM service object
const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' })

export default async ({ 
  auths, inputs, previous, time, 
}) => {
  // Whatever value you return here is
  // passed to component as the 'data' prop 
  // throw new Error ('Hello World')
  const params = {
    Marker: "", 
    MaxItems: 123
  }
  return new Promise((resolve, reject) => {
    lambda.listFunctions(params, (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })
  })
}