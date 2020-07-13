const typeParameter = (n) => `T${n}`

const generate = (n) => {
  if (n === 0) {
    return []
  }

  const typeParameters = Array.from({length: n + 1}, (_, n) =>
    typeParameter(n),
  ).join(', ')

  const parameters = Array.from(
    {length: n},
    (_, n) => `f${n + 1}: (a: ${typeParameter(n)}) => ${typeParameter(n + 1)}`,
  ).join(', ')

  const declaration = `<${typeParameters}>(${parameters}): (a: ${typeParameter(
    0,
  )}) => ${typeParameter(n)}`

  return generate(n - 1).concat([declaration])
}

const arities = generate(100).join('\n')

const interfaceString = `// Generated with "yarn generateFlowMaxType"

export interface FlowMaxType {
${arities}
}
`

process.stdout.write(interfaceString)
