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
          current_question_id: string | null
          current_question_position: number | null
          ended_at: string | null
          host_id: string
          id: string
          join_code: string
          quiz_id: string
          quiz_title: string
          round_closed_at: string | null
          round_started_at: string | null
          round_state: 'waiting' | 'question_open' | 'round_results'
          started_at: string | null
          state: 'lobby' | 'in_progress' | 'finished'
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_question_id?: string | null
          current_question_position?: number | null
          ended_at?: string | null
          host_id: string
          id?: string
          join_code: string
          quiz_id: string
          quiz_title: string
          round_closed_at?: string | null
          round_started_at?: string | null
          round_state?: 'waiting' | 'question_open' | 'round_results'
          started_at?: string | null
          state?: 'lobby' | 'in_progress' | 'finished'
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_question_id?: string | null
          current_question_position?: number | null
          ended_at?: string | null
          host_id?: string
          id?: string
          join_code?: string
          quiz_id?: string
          quiz_title?: string
          round_closed_at?: string | null
          round_started_at?: string | null
          round_state?: 'waiting' | 'question_open' | 'round_results'
          started_at?: string | null
          state?: 'lobby' | 'in_progress' | 'finished'
          updated_at?: string
        }
        Relationships: []
      }
      answers: {
        Row: {
          awarded_bonus: number
          awarded_score: number
          created_at: string
          id: string
          is_correct: boolean | null
          participant_id: string
          question_id: string
          question_option_id: string
          response_ms: number
          session_id: string
          submitted_at: string
          updated_at: string
        }
        Insert: {
          awarded_bonus?: number
          awarded_score?: number
          created_at?: string
          id?: string
          is_correct?: boolean | null
          participant_id: string
          question_id: string
          question_option_id: string
          response_ms?: number
          session_id: string
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          awarded_bonus?: number
          awarded_score?: number
          created_at?: string
          id?: string
          is_correct?: boolean | null
          participant_id?: string
          question_id?: string
          question_option_id?: string
          response_ms?: number
          session_id?: string
          submitted_at?: string
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
      public_session_lobbies: {
        Row: {
          created_at: string
          join_code: string
          participant_count: number
          quiz_title: string
          session_id: string
          state: 'lobby' | 'in_progress' | 'finished'
          updated_at: string
        }
        Insert: {
          created_at?: string
          join_code: string
          participant_count?: number
          quiz_title: string
          session_id: string
          state: 'lobby' | 'in_progress' | 'finished'
          updated_at?: string
        }
        Update: {
          created_at?: string
          join_code?: string
          participant_count?: number
          quiz_title?: string
          session_id?: string
          state?: 'lobby' | 'in_progress' | 'finished'
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      advance_live_round: {
        Args: {
          p_session_id: string
        }
        Returns: undefined
      }
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
      close_live_round: {
        Args: {
          p_session_id: string
        }
        Returns: undefined
      }
      delete_question_and_reorder: {
        Args: {
          p_quiz_id: string
          p_question_id: string
        }
        Returns: undefined
      }
      get_player_session_state: {
        Args: {
          p_join_code: string
          p_participant_id: string
          p_session_token: string
        }
        Returns: Json
      }
      get_public_session_state: {
        Args: {
          p_join_code: string
        }
        Returns: Json
      }
      get_session_participant: {
        Args: {
          p_participant_id: string
          p_session_id: string
          p_session_token: string
        }
        Returns: {
          id: string
          nickname: string
        }[]
      }
      join_live_session: {
        Args: {
          p_join_code: string
          p_nickname: string
        }
        Returns: {
          nickname: string
          participant_id: string
          session_token: string
          session_id: string
        }[]
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
      submit_player_answer: {
        Args: {
          p_join_code: string
          p_option_id: string
          p_participant_id: string
          p_session_token: string
        }
        Returns: Json
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
      round_state: 'waiting' | 'question_open' | 'round_results'
      session_state: 'lobby' | 'in_progress' | 'finished'
    }
    CompositeTypes: Record<string, never>
  }
}
