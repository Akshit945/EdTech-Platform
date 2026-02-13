const { Agent, run, tool, InputGuardrailTripwireTriggered } = require("@openai/agents")
const { z } = require("zod")
const Course = require("../models/Course")
const Category = require("../models/Category")
const User = require("../models/User")

// Tool Implementation Functions
const getAllCoursesLogic = async () => {
    try {
        const courses = await Course.find({ status: "Published" }, {
            courseName: true,
            price: true,
            courseDescription: true,
            instructor: true,
            category: true,
            _id: true,
        }).populate("instructor", "firstName lastName").populate("category", "name");

        // Transform for better readability by the agent
        const simplifiedCourses = courses.map(course => ({
            id: course._id,
            name: course.courseName,
            price: course.price,
            description: course.courseDescription,
            instructor: course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : "Unknown",
            category: course.category ? course.category.name : "Uncategorized",
            link: `/courses/${course._id}`
        }))

        return JSON.stringify(simplifiedCourses)
    } catch (error) {
        return "Error fetching courses."
    }
}

const getContactDetailsLogic = () => {
    return JSON.stringify({
        email: "support@skillsync.com",
        phone: "+1 (555) 123-4567",
        address: "123 Innovation Drive, Tech City, TC 90001",
        hours: "Mon-Fri 9am-6pm EST",
        contactPage: "/contact",
        aboutPage: "/about"
    })
}

const getAllCategoriesLogic = async () => {
    try {
        const categories = await Category.find({}, { name: true, description: true })
        return JSON.stringify(categories)
    } catch (error) {
        return "Error fetching categories."
    }
}

const getPageRoutesLogic = () => {
    return JSON.stringify({
        home: "/",
        about: "/about",
        contact: "/contact",
        login: "/login",
        signup: "/signup",
        catalog: "/catalog/:catalogName (replace :catalogName with category name)",
        dashboard: "/dashboard/my-profile",
        courses: "/courses/:courseId (replace :courseId with actual course ID)"
    })
}

// Define Tools
const getAllCoursesTool = tool({
    name: "getAllCourses",
    description: "Get a list of all available published courses with their prices, instructor names, categories, and direct links.",
    parameters: z.object({}),
    execute: getAllCoursesLogic,
})

const getContactDetailsTool = tool({
    name: "getContactDetails",
    description: "Get the contact details for SkillSync support including email, address, and operation hours.",
    parameters: z.object({}),
    execute: getContactDetailsLogic,
})

const getAllCategoriesTool = tool({
    name: "getAllCategories",
    description: "Get a list of all course categories/types available on the platform.",
    parameters: z.object({}),
    execute: getAllCategoriesLogic,
})

const getPageRoutesTool = tool({
    name: "getPageRoutes",
    description: "Get the internal routes/URLs for various pages like About Us, Contact, Login, etc. Use this to guide users where to go.",
    parameters: z.object({}),
    execute: getPageRoutesLogic,
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
            return { tripwireTriggered: false }
        }
    },
}

// Define Main Agent
const agent = new Agent({
    name: "SkillSync Agent",
    instructions: `You are SkillSync AI, a helpful and knowledgeable assistant for the SkillSync EdTech platform.
      Your role is to assist users in finding courses, getting support, navigating the platform, and understanding what we offer.
    
      Guidelines:
      - Be polite, professional, and concise.
      - Use the available tools to fetch real-time data about courses, categories, contact info, and page routes.
      - If a user asks how to buy a course, use 'getAllCourses' to find relevant courses and provide the link (e.g., /courses/123).
      - If a user asks about course types, use 'getAllCategories'.
      - If a user asks where to find something (About Us, Contact), use 'getPageRoutes' or 'getContactDetails'.
      - If you don't know the answer and the tools don't help, admit it gracefully.
      - Do not make up course details. Always check the database using tools.
      - Current platform name: SkillSync.
      - Current platform URL: https://akshit945-edtech.vercel.app/ (Base URL)
      - Provide relative paths for internal navigation (e.g., /about, /contact).
      -Make sure links are highlighted using markdown
      
      Rules:
        - Do NOT engage in general conversation
        - Do NOT answer math/homework questions
        - Stay focused on SkillSync platform only
      `,
    inputGuardrails: [mathGuardrail],
    tools: [getAllCoursesTool, getContactDetailsTool, getAllCategoriesTool, getPageRoutesTool],
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


