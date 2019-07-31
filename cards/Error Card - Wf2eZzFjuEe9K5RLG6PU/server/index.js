export default async ({ 
  auths, inputs, previous, time, 
}) => {
  // Whatever value you return here is
  // passed to component as the 'data' prop 
  throw new Error ('Hello World')
  return previous + 1
}