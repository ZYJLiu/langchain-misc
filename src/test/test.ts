//  npm run start ./test/test.ts
import { OpenAI, OpenAIChat } from "langchain/llms"
import { PromptTemplate } from "langchain/prompts"
import { LLMChain, ConversationChain } from "langchain/chains"
import { CallbackManager } from "langchain/callbacks"
import { LLMResult } from "langchain/schema"
import { BufferMemory } from "langchain/memory"

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

  // const template = "{input}"
  // const prompt = new PromptTemplate({
  //   template: template,
  //   inputVariables: ["input"],
  // })

  const memory = new BufferMemory({
    // returnMessages: true,
    // memoryKey: "chat_history",
  })
  const chain = new ConversationChain({
    llm: model,
    // prompt: prompt,
    memory: memory,
  })
  const res = await chain.call({
    input: "What is the best yummy snack?",
  })
  console.log({ res })
  const res2 = await chain.call({
    input: "What was the previous question?",
  })
  console.log({ res2 })
  const res3 = await chain.call({
    input:
      "What was the first question? What was the previous question before this one?",
  })
  console.log({ res3 })
}
