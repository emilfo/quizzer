export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          created_at: string
          host_id: string
          id: string
          published_at: string | null
          status: 'draft' | 'published'
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          host_id: string
          id?: string
          published_at?: string | null
          status?: 'draft' | 'published'
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          host_id?: string
          id?: string
          published_at?: string | null
          status?: 'draft' | 'published'
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          created_at: string
          id: string
          position: number
          prompt: string
          quiz_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          position: number
          prompt?: string
          quiz_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          position?: number
          prompt?: string
          quiz_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      question_options: {
        Row: {
          created_at: string
          id: string
          is_correct: boolean
          option_text: string
          position: number
          question_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_correct?: boolean
          option_text?: string
          position: number
          question_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_correct?: boolean
          option_text?: string
          position?: number
          question_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      quiz_sessions: {
        Row: {
          created_at: string
          ended_at: string | null
          host_id: string
          id: string
          join_code: string
          quiz_id: string
          quiz_title: string
          started_at: string | null
          state: 'lobby' | 'in_progress' | 'finished'
          updated_at: string
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          host_id: string
          id?: string
          join_code: string
          quiz_id: string
          quiz_title: string
          started_at?: string | null
          state?: 'lobby' | 'in_progress' | 'finished'
          updated_at?: string
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          host_id?: string
          id?: string
          join_code?: string
          quiz_id?: string
          quiz_title?: string
          started_at?: string | null
          state?: 'lobby' | 'in_progress' | 'finished'
          updated_at?: string
        }
        Relationships: []
      }
      participants: {
        Row: {
          created_at: string
          id: string
          nickname: string
          session_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nickname: string
          session_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nickname?: string
          session_id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      add_question_with_options: {
        Args: {
          p_quiz_id: string
        }
        Returns: string
      }
      create_live_session: {
        Args: {
          p_quiz_id: string
        }
        Returns: string
      }
      delete_question_and_reorder: {
        Args: {
          p_quiz_id: string
          p_question_id: string
        }
        Returns: undefined
      }
      move_question_position: {
        Args: {
          p_quiz_id: string
          p_question_id: string
          p_direction: string
        }
        Returns: undefined
      }
      publish_quiz_if_valid: {
        Args: {
          p_quiz_id: string
        }
        Returns: undefined
      }
      quiz_is_publishable: {
        Args: {
          p_quiz_id: string
        }
        Returns: boolean
      }
      save_question_with_options: {
        Args: {
          p_quiz_id: string
          p_question_id: string
          p_prompt: string
          p_options: Json
        }
        Returns: undefined
      }
      start_live_session: {
        Args: {
          p_session_id: string
        }
        Returns: undefined
      }
      sync_quiz_status: {
        Args: {
          p_quiz_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      quiz_status: 'draft' | 'published'
      session_state: 'lobby' | 'in_progress' | 'finished'
    }
    CompositeTypes: Record<string, never>
  }
}
