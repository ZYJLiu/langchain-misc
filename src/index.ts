import path from "path"

const [exampleName, ...args] = process.argv.slice(2)

console.log(exampleName, ...args)

const __dirname = path.dirname(new URL(import.meta.url).pathname)

let runExample

import(path.join(__dirname, exampleName))
  .then((module) => {
    runExample = module.run
    runExample()
  })
  .catch(() => {
    throw new Error(`Could not load example ${exampleName}`)
  })
