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
        const lastMessage = Array.isArray(input) ? input[input.length - 1].content : input
        // Prevent crash if input is empty or malformed
        if (!lastMessage) return { tripwireTriggered: false }
        const textCheck = lastMessage[0].text

        try {
            const result = await run(mathCheckAgent, textCheck)
            return {
                tripwireTriggered: result.finalOutput.isMathHomework,
            }
        } catch (err) {
            console.error("Guardrail Agent Error:", err)
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
        - Stay focused on SkillSync platform only
      `,
    inputGuardrails: [mathGuardrail],
    tools: [getAllCoursesTool, getContactDetailsTool],
})

exports.chatAgent = async (req, res) => {
    try {
        const { messages } = req.body

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({
                success: false,
                message: "Messages array is required",
            })
        }

        const trimmedMessages = messages.slice(-50)
        const formattedMessages = trimmedMessages.map(msg => ({
            role: msg.role,
            content: [{ type: msg.role === "assistant" ? "output_text" : "input_text", text: msg.content }]
        }))

        const result = await run(agent, formattedMessages)

        return res.status(200).json({
            success: true,
            message: { role: "assistant", content: result.finalOutput },
        })

    } catch (error) {
        if (error instanceof InputGuardrailTripwireTriggered) {
            return res.status(200).json({
                success: true,
                message: {
                    role: "assistant",
                    content: "I cannot assist with math Homework questions 😂"
                }
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


