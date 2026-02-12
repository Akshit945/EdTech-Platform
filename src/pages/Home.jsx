import React from 'react'
import { FaArrowRight } from "react-icons/fa"
import { Link } from "react-router-dom"
import HighlightText from '../components/core/HomePage/HighlightText'

import CTAButton from "../components/core/HomePage/Button"
// import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from "../components/core/HomePage/CodeBlocks"
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection'
import InstructorSection from '../components/core/HomePage/InstructorSection'
import Footer from '../components/common/Footer'
import ExploreMore from '../components/core/HomePage/ExploreMore'
import ReviewSlider from "../components/common/ReviewSlider"
import { useSelector } from 'react-redux'

const Home = () => {
    const { token } = useSelector((state) => state.auth)
    return (
        <div>
            {/* Hero Section */}
            <div className='relative mx-auto flex flex-col w-full items-center text-white justify-between overflow-hidden'>

                {/* Aurora Background */}
                <div className='aurora-bg'></div>

                <div className='relative z-10 w-11/12 max-w-maxContent flex flex-col items-center gap-8 py-32'>

                    {/* Badge */}
                    <Link to={"/signup"}>
                        <div className='group p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit border border-richblack-700 hover:border-blue-200 glass-card'>
                            <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900/50'>
                                <p>Become an Instructor</p>
                                <FaArrowRight />
                            </div>
                        </div>
                    </Link>

                    {/* Heading */}
                    <div className='text-center text-5xl md:text-6xl font-bold mt-7 tracking-tight'>
                        Empower Your Future with <br />
                        <span className='text-neon-gradient'>Coding Skills</span>
                    </div>

                    {/* Subheading */}
                    <div className='mt-4 w-[90%] md:w-[60%] text-center text-lg font-medium text-richblack-300'>
                        With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
                    </div>

                    {/* Buttons */}
                    <div className='flex flex-row gap-7 mt-8'>
                        <CTAButton active={true} linkto={"/signup"}>
                            Learn More
                        </CTAButton>
                        <CTAButton active={false} linkto={"/login"}>
                            Book a Demo
                        </CTAButton>
                    </div>

                    {/* Video / Glass Container */}
                    <div className='mx-3 my-12 shadow-blue-200 glass-card p-2 rounded-3xl mt-20'>
                        <video
                            muted
                            loop
                            autoPlay
                            className="rounded-2xl"
                        >
                            {/* <source src={Banner} type="video/mp4" /> */}
                        </video>
                    </div>

                    {/* Code Section 1 - Now part of the flow */}
                    <div>
                        <CodeBlocks
                            position={"lg:flex-row"}
                            heading={
                                <div className='text-4xl font-semibold'>
                                    Unlock Your
                                    <HighlightText text={"coding potential"} />
                                    with our online courses
                                </div>
                            }
                            subheading={
                                "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                            }
                            ctabtn1={
                                {
                                    btnText: "try it yourself",
                                    linkto: "/signup",
                                    active: true,
                                }
                            }
                            ctabtn2={
                                {
                                    btnText: "learn more",
                                    linkto: "/login",
                                    active: false,
                                }
                            }

                            codeblock={`<<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet"href="styles.css">\n/head>\n`}
                            codeColor={"text-yellow-25"}
                        />
                    </div>

                    {/* Code Section 2 */}
                    <div>
                        <CodeBlocks
                            position={"lg:flex-row-reverse"}
                            heading={
                                <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                                    Start
                                    <HighlightText text={"coding in seconds"} />
                                </div>
                            }
                            subheading={
                                "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                            }
                            ctabtn1={{
                                btnText: "Continue Lesson",
                                link: "/signup",
                                active: true,
                            }}
                            ctabtn2={{
                                btnText: "Learn More",
                                link: "/signup",
                                active: false,
                            }}
                            codeColor={"text-white"}
                            codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
                            backgroundGradient={<div className="codeblock2 absolute"></div>}
                        />
                    </div>

                    <ExploreMore />
                </div>
            </div>

            {/* Section 2 - Bento Grid Features */}
            <div className='bg-richblack-900 text-richblack-100 py-20'>
                <div className='w-11/12 max-w-maxContent mx-auto flex flex-col items-center justify-between gap-8'>

                    <div className='text-4xl font-semibold text-center'>
                        Why Choose <HighlightText text={"SkillSync?"} />
                    </div>

                    {/* Bento Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-10'>

                        {/* Card 1 */}
                        <div className='glass-card p-8 rounded-3xl flex flex-col gap-4 hover:scale-105 transition-all duration-300'>
                            <div className='text-neon-gradient text-3xl font-bold'>Real-World Projects</div>
                            <p className='text-richblack-300'>Do not just watch tutorials. Build real applications that you can add to your portfolio and show to potential employers.</p>
                        </div>

                        {/* Card 2 */}
                        <div className='glass-card p-8 rounded-3xl flex flex-col gap-4 hover:scale-105 transition-all duration-300 md:col-span-2'>
                            <div className='text-neon-gradient text-3xl font-bold'>Expert Instructors</div>
                            <p className='text-richblack-300'>Learn from industry veterans who have worked at top tech companies. Get feedback on your code and career advice.</p>
                            <div className='flex gap-4 mt-4'>
                                <div className='h-12 w-12 rounded-full bg-richblack-800 border border-richblack-700'></div>
                                <div className='h-12 w-12 rounded-full bg-richblack-800 border border-richblack-700'></div>
                                <div className='h-12 w-12 rounded-full bg-richblack-800 border border-richblack-700'></div>
                                <div className='h-12 w-12 rounded-full bg-richblack-800 border border-richblack-700 flex items-center justify-center text-xs'>+50</div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className='glass-card p-8 rounded-3xl flex flex-col gap-4 hover:scale-105 transition-all duration-300 md:col-span-2'>
                            <div className='text-neon-gradient text-3xl font-bold'>Interactive Learning</div>
                            <p className='text-richblack-300'>Our platform features built-in coding environments, quizzes, and progress tracking to keep you engaged.</p>
                        </div>

                        {/* Card 4 */}
                        <div className='glass-card p-8 rounded-3xl flex flex-col gap-4 hover:scale-105 transition-all duration-300'>
                            <div className='text-neon-gradient text-3xl font-bold'>24/7 Support</div>
                            <p className='text-richblack-300'>Stuck on a bug? Our community and mentors are always available to help you unblock and keep moving forward.</p>
                        </div>

                    </div>

                    <div className='mt-20'>
                        <LearningLanguageSection />
                    </div>

                </div>
            </div>


            {/*Section 3 */}
            <div className='w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white'>

                <InstructorSection />

                <h2 className='text-center text-4xl font-semobold mt-10'>Review from Other Learners</h2>
                {/* Review Slider here */}

                <ReviewSlider />

            </div>


            {/*Footer */}
            <Footer />

        </div>
    )
}

export default Home
