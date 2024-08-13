const Quiz =require('./../models/quiz')
const {
    responseSender,
    updateResponseSender,
  } = require("./../helpers/wrappers/response-sender");
  const Course = require('./../models/course')
  module.exports={
   addQuiz: async(req,res)=>{
    const newQuiz = await Quiz.create(req.body)
    responseSender(res,newQuiz);
   },
   getAllQuiz: async(req,res)=>{
    const courseId = req.params.id
    const quizes= await Course.findById(courseId).select("quiz").populate('quiz')
    responseSender(res,quizes)
   },
   getQuiz: async(req,res)=>{
    const quiz = await Quiz.findById(req.params.id).populate('qustions')
    responseSender(res,quiz)
   },
   updateQuiz:async(req,res)=>{
    const quiz = await Quiz.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValdiators:true
    }).populate('qustions')
    res.status(202).json({
        status:'succsess',
        result: quiz
    })
   },
   deleteQuiz: async (req,res)=>{
    await Quiz.findByIdAndDelete(req.params.id)
    res.status(204).json({
        status: 'succsess',
        result:null
    })
   }
  }