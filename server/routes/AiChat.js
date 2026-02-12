const express = require("express")
const router = express.Router()
const { chatAgent } = require("../controllers/AiAgent")
const { auth, isStudent } = require("../middleware/auth")

router.post("/chat", chatAgent)

module.exports = router
