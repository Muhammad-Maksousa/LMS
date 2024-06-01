const { default: mongoose, model } = require("mongoose");
const questionSchema = mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answers: [{ type: String, required: true }],
  true_answer: { 
    type: String ,
    required:true
},
});
const Question=mongoose.model('Question',questionSchema)
module.exports=Question