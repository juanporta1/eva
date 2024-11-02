import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Session } from '../../entities/session.entity';
import { Interaction } from '../../entities/interaction.entity';
import { DbmanagerService } from '../dbmanager/dbmanager.service';

type Message = {
    role: "system" | "user" | "assistant",
    content: string
}

const CHATGPT_KEY = process.env.CHATGPTKEY;


@Injectable()
export class EvaService {
   constructor(private readonly dbManager: DbmanagerService){}
   openai = new OpenAI({apiKey: CHATGPT_KEY});
   async clientCall(context:Message[], temperature: number, max_tokens: number){
      
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

   private async getUpdatedUserContext(prompt: string, userContext: string){
      const updatedUserContext = this.clientCall([
         {"role": "system","content": "Tu tarea es gestionar el contexto de un usuario manteniendo solo la información relevante de forma resumida. Cuando el usuario envíe un mensaje (prompt), analiza si el mensaje contiene nueva información importante, cambios en gustos o datos relevantes sobre su situación. Debes actualizar el contexto del usuario añadiendo, eliminando o modificando información según lo expresado en el mensaje del usuario. Si el mensaje no aporta nuevos datos relevantes, mantén el contexto sin cambios."},
         {"role": "user","content": "Prompt: Me gusta mucho el básquet. Contexto Actual: No se tiene nignún contexto sobre este usuario."},
         {"role": "assistant","content": "Actualmente le gusta mucho el básquet. "},
         {"role": "user","content": "Prompt: Hola, ¿Todo bien? Contexto Actual: Actualmente le gusta mucho el básquet."},
         {"role": "assistant","content": "Actualmente le gusta mucho el básquet."},
         {"role": "user","content": "Prompt: Voy al colegio secundario, ya no sé si me gusta tanto el básquet, pero sí sé que me gustan mucho los Beatles. Contexto Actual: Actualmente le gusta mucho el básquet."},
         {"role": "assistant","content": "Estudia en el colegio secundario. Antes le gustaba mucho el básquet, pero ya no está seguro. Actualmente le gustan los Beatles."},
         {"role": "user","content": "Prompt: Me gusta mucho Guns n' Roses. Contexto Actual: Estudia en el colegio secundario. Antes le gustaba mucho el básquet, pero ya no está seguro. Actualmente le gustan los Beatles."},
         {"role": "assistant","content": "Estudia en el colegio secundario. Antes le gustaba mucho el básquet, pero ya no está seguro. Actualmente le gustan los Beatles y Guns n' Roses."},
         {"role": "user", "content": "Prompt: "+ prompt + " Contexto Actual: " + userContext}
       ],0, 1000)
       console.log(updatedUserContext)
       return updatedUserContext;
   }

   private async createContextFromSession(interactions: Interaction[]): Promise<Message[]> {
      const context: Message[] = [];
      interactions.forEach((interaction) => {
         context.push({"role": "user", "content": interaction.userPrompt})
         context.push({"role": "assistant", "content": interaction.evaReply})
      })
      return context;
   }
   async getReply(session: Session, prompt: string){
      const userContext = session.user.userContext
      const [updatedUserContext, sessionContext] = await Promise.all([this.getUpdatedUserContext(prompt,userContext), this.createContextFromSession(session.interactions)])

      const reply = await this.clientCall([
         {"role": "system","content": "Eres Eva, un asistente de inteligencia artificial inspirado en el personaje de EVA de la película Wall-E. Tu propósito es ayudar a los usuarios a mejorar su habilidad en el idioma que están aprendiendo mediante conversaciones interactivas y correcciones útiles. Eres amigable, paciente y motivas a los usuarios a practicar su lenguaje en situaciones cotidianas, corregir errores y ampliar vocabulario. Puedes sugerir actividades o juegos de palabras, responder preguntas y dar retroalimentación constructiva. Haz que la conversación sea natural, divertida y educativa. Recibiras una variable llamada 'userContext' que proporciona información sobre la persona con la que estás hablando. Si recibes el contexto 'No se tiene ningún contexto sobre este usuario', significa que aún no conoces bien al usuario y debes comenzar a construir una relación a través de preguntas abiertas y conversaciones para aprender más sobre sus intereses y necesidades en el aprendizaje del idioma."},
         {"role": "system", "content": "userContext: "+ updatedUserContext},
         ...sessionContext,
         {"role": "user", "content": prompt}],1,1000)

         return {
            "sessionContext": sessionContext,
            "prompt": prompt,
            "updatedUserContext": updatedUserContext,
            "reply": reply
         }
   }

   
 }


