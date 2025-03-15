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
      projects: {
        Row: {
          id: string
          title: string
          description: string
          address: string
          status: "planning" | "in-progress" | "completed" | "on-hold"
          homeownerId: string
          homeownerName: string
          builderId?: string
          createdAt: string
          updatedAt: string
          thumbnail?: string
          progress: number
        }
        Insert: {
          id?: string
          title: string
          description: string
          address: string
          status: "planning" | "in-progress" | "completed" | "on-hold"
          homeownerId: string
          homeownerName: string
          builderId?: string
          createdAt?: string
          updatedAt?: string
          thumbnail?: string
          progress: number
        }
        Update: {
          id?: string
          title?: string
          description?: string
          address?: string
          status?: "planning" | "in-progress" | "completed" | "on-hold"
          homeownerId?: string
          homeownerName?: string
          builderId?: string
          createdAt?: string
          updatedAt?: string
          thumbnail?: string
          progress?: number
        }
      }
      project_images: {
        Row: {
          id: string
          projectId: string
          url: string
          caption: string
          createdAt: string
          category: "interior" | "exterior" | "structural" | "finishes" | "other" | "general"
        }
        Insert: {
          id?: string
          projectId: string
          url: string
          caption: string
          createdAt?: string
          category: "interior" | "exterior" | "structural" | "finishes" | "other" | "general"
        }
        Update: {
          id?: string
          projectId?: string
          url?: string
          caption?: string
          createdAt?: string
          category?: "interior" | "exterior" | "structural" | "finishes" | "other" | "general"
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: "admin" | "builder" | "homeowner"
          avatar?: string
          createdAt: string
          phone?: string
          builderId?: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: "admin" | "builder" | "homeowner"
          avatar?: string
          createdAt?: string
          phone?: string
          builderId?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: "admin" | "builder" | "homeowner"
          avatar?: string
          createdAt?: string
          phone?: string
          builderId?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 