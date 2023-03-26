//  npm run start ./test/test.ts
import { OpenAI, OpenAIChat } from "langchain/llms"
import { PromptTemplate } from "langchain/prompts"
import { LLMChain } from "langchain/chains"
import { CallbackManager } from "langchain/callbacks"
import { LLMResult } from "langchain/schema"

export async function run() {
  const callbackManager = CallbackManager.fromHandlers({
    handleLLMStart: async (llm: { name: string }, prompts: string[]) => {
      console.log(JSON.stringify(llm, null, 2))
      console.log(JSON.stringify(prompts, null, 2))
    },
    handleLLMEnd: async (output: LLMResult) => {
      console.log(JSON.stringify(output, null, 2))
    },
    handleLLMError: async (err: Error) => {
      console.error(err)
    },
    // // streams token answers
    // async handleLLMNewToken(token: string) {
    //   console.log({ token })
    // },
  })

  const model = new OpenAIChat({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-3.5-turbo",
    // prefixMessages: history,
    temperature: 1,
    streaming: true,
    verbose: true,
    callbackManager,
  })

  const template =
    "Provide {number} good names for a company that makes {product}? And explain why"
  const prompt = new PromptTemplate({
    template: template,
    inputVariables: ["product", "number"],
  })
  const chain = new LLMChain({ llm: model, prompt: prompt })
  const res = await chain.call({ product: "Yummy snacks", number: 2 })
  console.log({ res })
}
