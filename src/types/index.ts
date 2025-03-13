export type UserRole = "admin" | "builder" | "homeowner";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  projects?: Project[];
  phone?: string;
  builderId?: string;
  builderName?: string;
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
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
  progress: number; // 0-100
}

export interface ProjectImage {
  id: string;
  projectId: string;
  url: string;
  caption: string;
  createdAt: Date;
  category: "interior" | "exterior" | "structural" | "finishes" | "other";
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
