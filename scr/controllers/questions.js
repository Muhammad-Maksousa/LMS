const Question=require('./../models/question')
const {
    responseSender,
    updateResponseSender,
  } = require("./../helpers/wrappers/response-sender");
  const Quiz  = require("./../models/quiz")
module.exports={
   addQuestion: async (req,res)=>{
    const newQuestion = await Question.create(req.body)
    responseSender(res,newQuestion)
   },
   getAllQuestions: async(req,res)=>{
    const quizId = req.params.id
    const questions = await Quiz.findById(quizId).select("qustions").populate("qustions");
    responseSender(res,questions)
   },
   getQuestion: async(req,res)=>{
     const question = await Question.findById(req.params.id)
     responseSender(res,question)
   },
   updateQuestion: async (req,res)=>{
    const question= await Question.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValdiators:true
    })
    updateResponseSender(res,question)
   },
   deleteQuestion:async(req,res)=>{
    await Question.findByIdAndDelete(req.params.id)
    res.status(204).json({
        status:'succsess',
        result: null
    })
   }

   } 
