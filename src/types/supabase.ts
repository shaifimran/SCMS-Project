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
      departments: {
        Row: {
          id: string
          name: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      complaints: {
        Row: {
          id: string
          title: string
          description: string
          status: string
          priority: string
          department_id: string
          user_id: string
          staff_id: string | null
          is_appealed: boolean
          feedback: string | null
          remarks: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          status?: string
          priority?: string
          department_id: string
          user_id: string
          staff_id?: string | null
          is_appealed?: boolean
          feedback?: string | null
          remarks?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: string
          priority?: string
          department_id?: string
          user_id?: string
          staff_id?: string | null
          is_appealed?: boolean
          feedback?: string | null
          remarks?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}