const Quiz =require('./../models/quiz')
const {
    responseSender,
    updateResponseSender,
  } = require("./../helpers/wrappers/response-sender");
  module.exports={
   addQuiz: async(req,res)=>{
    const newQuiz = await Quiz.create(req.body)
    responseSender(res,newQuiz);
   },
   getAllQuiz: async(req,res)=>{
    const quizes= await Quiz.find().populate('qustions')
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