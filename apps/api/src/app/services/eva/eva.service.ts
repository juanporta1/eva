import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
type Message = {
    role: "system" | "user" | "assistant",
    content: string
}

const CHATGPT_KEY = process.env.CHATGPTKEY;


@Injectable()
export class EvaService {
   openai = new OpenAI({apiKey: CHATGPT_KEY});
   async getReply(context: Array<Message>, temperature: number, max_tokens: number){
      
      try{ 
         
         const reply = await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature:temperature,
            max_tokens: max_tokens,
            messages: context
         })
         return reply.choices[0].message;
      } catch(err){
         console.log(err);
         throw err;
      }
   }


 }


