export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean; // New field for soft delete functionality
}