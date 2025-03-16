export type UserRole = "admin" | "builder" | "homeowner";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date | string;
  projects?: Project[];
  phone?: string;
  builderId?: string;
  builderName?: string;
  first_name?: string;
  last_name?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  address: string;
  status: "planning" | "in-progress" | "completed" | "on-hold";
  homeownerId: string;
  homeownerName: string;
  builderId?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  thumbnail?: string;
  progress: number; // 0-100
}

export interface ProjectImage {
  id: string;
  projectId: string;
  url: string;
  caption: string;
  createdAt: Date | string;
  category: "interior" | "exterior" | "structural" | "finishes" | "other" | "general";
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
  authError: string | null;
}
