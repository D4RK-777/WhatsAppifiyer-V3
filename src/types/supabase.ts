export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      message_feedback: {
        Row: {
          id: string
          user_id: string | null
          message_id: string
          is_positive: boolean
          feedback_text: string | null
          message_content: string
          message_metadata: Json
          formatting_analysis: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          message_id: string
          is_positive: boolean
          feedback_text?: string | null
          message_content: string
          message_metadata?: Json
          formatting_analysis?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          message_id?: string
          is_positive?: boolean
          feedback_text?: string | null
          message_content?: string
          message_metadata?: Json
          formatting_analysis?: Json
          created_at?: string
        }
      }
    }
    Views: {
      ai_training_data: {
        Row: {
          feedback_id: string
          message_id: string
          user_id: string | null
          is_positive: boolean
          feedback_text: string | null
          message_content: string
          message_metadata: Json
          formatting_analysis: Json
          created_at: string
        }
      }
    }
  }
}
