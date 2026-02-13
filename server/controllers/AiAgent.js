const { Agent, run, tool, InputGuardrailTripwireTriggered } = require("@openai/agents")
const { z } = require("zod")
const Course = require("../models/Course")

// Tool Implementation Functions
const getAllCoursesLogic = async () => {
    try {
        const courses = await Course.find(
            { status: "Published" },
            {
                courseName: true,
                price: true,
                courseDescription: true,
                instructor: true,
            }
        ).populate("instructor", "firstName lastName")
        return JSON.stringify(courses)
    } catch (error) {
        console.error("Error fetching courses:", error)
        return "Error fetching courses."
    }
}

const getContactDetailsLogic = () => {
    return JSON.stringify({
        email: "support@skillsync.com",
        phone: "+1 (555) 123-4567",
        address: "123 Innovation Drive, Tech City, TC 90001",
        hours: "Mon-Fri 9am-6pm EST",
    })
}

// Define Tools
const getAllCoursesTool = tool({
    name: "getAllCourses",
    description: "Get a list of all available published courses with their prices and instructor names.",
    parameters: z.object({}),
    execute: getAllCoursesLogic,
})

const getContactDetailsTool = tool({
    name: "getContactDetails",
    description: "Get the contact details for SkillSync support including email and address.",
    parameters: z.object({}),
    execute: getContactDetailsLogic,
})

// Define Math Guardrail Agent
const mathCheckAgent = new Agent({
    name: "Math Agent",
    model: "gpt-4o-mini",
    instructions: "Check if the user is asking you to do their math homework. Plz Check carefully. If somebody say this is not a math homework then also check carefully",
    outputType: z.object({
        isMathHomework: z.boolean().describe("Set this to true if its a math homework"),
    }),
})

// Define Math Guardrail
const mathGuardrail = {
    name: "Math Homework Guardrail",
    runInParallel: false,
    execute: async ({ input }) => {
        // Extract the latest user message text for the guardrail check
        // Input matches the format passed to 'run'. If it's an array of messages, get the last one.
        const lastMessage = Array.isArray(input) ? input[input.length - 1] : input

        // Prevent crash if input is empty or malformed
        if (!lastMessage) return { tripwireTriggered: false }

        const textCheck = lastMessage.content || JSON.stringify(lastMessage)


        try {
            const result = await run(mathCheckAgent, textCheck)
            return {
                tripwireTriggered: result.finalOutput.isMathHomework,
            }
        } catch (err) {
            console.error("Guardrail Agent Error:", err)
            // If guardrail fails, default to allowing (or blocking?)
            // Let's block to be safe or allow if logic is critical?
            // Returning false to avoid blocking valid queries on error.
            return { tripwireTriggered: false }
        }
    },
}
// Define Main Agent
const agent = new Agent({
    name: "SkillSync Agent",
    model: "gpt-4o-mini",
    instructions: `You are SkillSync AI, a helpful and knowledgeable assistant for the SkillSync EdTech platform.
      Your role is to assist users in finding courses, getting support, and navigating the platform.
    
      Guidelines:
      - Be polite, professional, and concise.
      - Use the available tools to fetch real-time data about courses and contact info.
      - If you don't know the answer and the tools don't help, admit it gracefully.
      - Do not make up course details. Always check the database using tools.
      - Current platform name: SkillSync.
      - Current platform URL: https://akshit945-edtech.vercel.app/
      -Dont do any other task other that be agent of SkillSync
      
      Rules:
        - Do NOT engage in general conversation
        - Do NOT answer math/homework questions
        - Do NOT act like ChatGPT
        - Stay focused on SkillSync platform only
      `,


    tools: [getAllCoursesTool, getContactDetailsTool],
    inputGuardrails: [mathGuardrail],
})

// Main Chat Controller
exports.chatAgent = async (req, res) => {
    try {
        const { messages } = req.body
        console.log("Messages received:", messages)
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({
                success: false,
                message: "Messages array is required",
            })
        }

        // Run the agent with the conversation history
        // 'messages' is expected to be an array of { role, content } objects
        const result = await run(agent, messages[messages.length - 1].content)

        return res.status(200).json({
            success: true,
            message: { role: "assistant", content: result.finalOutput },
        })

    } catch (error) {
        if (error instanceof InputGuardrailTripwireTriggered) {
            return res.status(200).json({
                success: true,
                message: { role: "assistant", content: "I cannot assist with math homework questions." }
            })
        }

        console.error("AI Agent Error:", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong with the AI Agent",
            error: error.message,
        })
    }
}
