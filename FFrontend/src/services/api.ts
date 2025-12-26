import { toast } from 'sonner';

// Configure your Laravel backend URL here
// Using optional chaining and nullish coalescing to prevent errors
export const API_BASE_URL = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) 
  || 'http://localhost:8000/api';

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Request configuration
const getHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Generic API call handler with error handling
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle Laravel validation errors
      if (response.status === 422 && data.errors) {
        const firstError = Object.values(data.errors)[0] as string[];
        throw new Error(firstError[0]);
      }
      
      // Handle authentication errors
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userType');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }

      throw new Error(data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
      throw error;
    }
    toast.error('Network error. Please check your connection.');
    throw new Error('Network error');
  }
}

// ============================================
// AUTHENTICATION API
// ============================================
export const authApi = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    user_type: 'freelancer' | 'employer';
  }) {
    return apiCall<ApiResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async login(email: string, password: string) {
    return apiCall<ApiResponse<{ token: string; user: any }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async logout() {
    return apiCall<ApiResponse>('/auth/logout', {
      method: 'POST',
    });
  },

  async getCurrentUser() {
    return apiCall<ApiResponse>('/auth/user');
  },

  async getAllUsers() {
    return apiCall<ApiResponse>('/auth/users');
  },
};

// ============================================
// FREELANCERS API
// ============================================
export const freelancersApi = {
  async getAll(params?: {
    search?: string;
    skills?: string[];
    location?: string;
    min_rate?: number;
    max_rate?: number;
    sort_by?: string;
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return apiCall<ApiResponse>(`/freelancers${queryString}`);
  },

  async getById(id: number) {
    return apiCall<ApiResponse>(`/freelancers/${id}`);
  },

  async create(data: any) {
    return apiCall<ApiResponse>('/freelancers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: any) {
    return apiCall<ApiResponse>(`/freelancers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: number) {
    return apiCall<ApiResponse>(`/freelancers/${id}`, {
      method: 'DELETE',
    });
  },

  async getSkills(id: number) {
    return apiCall<ApiResponse>(`/freelancers/${id}/skills`);
  },

  async getPortfolio(id: number) {
    return apiCall<ApiResponse>(`/freelancers/${id}/portfolio`);
  },

  async uploadProfilePicture(id: number, file: File) {
    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/freelancers/${id}/profile-picture`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      const message = (data && data.message) || 'Failed to upload profile picture';
      toast.error(message);
      throw new Error(message);
    }

    return data;
  },
};

// ============================================
// EMPLOYERS API
// ============================================
export const employersApi = {
  async getAll(params?: {
    search?: string;
    industry?: string;
    location?: string;
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return apiCall<ApiResponse>(`/employers${queryString}`);
  },

  async getById(id: number) {
    return apiCall<ApiResponse>(`/employers/${id}`);
  },

  async create(data: any) {
    return apiCall<ApiResponse>('/employers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: any) {
    return apiCall<ApiResponse>(`/employers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: number) {
    return apiCall<ApiResponse>(`/employers/${id}`, {
      method: 'DELETE',
    });
  },

  async getBookmarks(id: number) {
    return apiCall<ApiResponse>(`/employers/${id}/bookmarks`);
  },

  async uploadCompanyLogo(id: number, file: File) {
    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/employers/${id}/company-logo`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      const message = (data && data.message) || 'Failed to upload company logo';
      toast.error(message);
      throw new Error(message);
    }

    return data;
  },
};

// ============================================
// SKILLS API
// ============================================
export const skillsApi = {
  async getAll() {
    return apiCall<ApiResponse>('/skills');
  },

  async create(data: {
    FreelancerID: number;
    SkillName: string;
    ProficiencyLevel?: string;
    YearsOfExperience?: number;
    Certification?: 'Yes' | 'No';
  }) {
    return apiCall<ApiResponse>('/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: {
    SkillName?: string;
    ProficiencyLevel?: string;
    YearsOfExperience?: number;
    Certification?: 'Yes' | 'No' | null;
  }) {
    return apiCall<ApiResponse>(`/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: number) {
    return apiCall<ApiResponse>(`/skills/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// PORTFOLIO API
// ============================================
export const portfolioApi = {
  async getAll() {
    return apiCall<ApiResponse>('/portfolio-work');
  },

  async create(data: {
    FreelancerID: number;
    ProjectTitle: string;
    ProjectDescription?: string;
    TechnologiesUsed?: string;
    CompletionDate?: string;
    ProjectURL?: string;
    ProjectFile?: string | null;
  }) {
    return apiCall<ApiResponse>('/portfolio-work', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: {
    ProjectTitle?: string;
    ProjectDescription?: string;
    TechnologiesUsed?: string;
    CompletionDate?: string;
    ProjectURL?: string;
    ProjectFile?: string | null;
  }) {
    return apiCall<ApiResponse>(`/portfolio-work/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: number) {
    return apiCall<ApiResponse>(`/portfolio-work/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// EDUCATION API
// ============================================
export const educationApi = {
  async getAll() {
    return apiCall<ApiResponse>('/education');
  },

  async create(data: {
    FreelancerID: number;
    Degree: string;
    Major: string;
    InstitutionName: string;
    GraduationYear: number;
    GPA?: number | null;
  }) {
    return apiCall<ApiResponse>('/education', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: {
    Degree?: string;
    Major?: string;
    InstitutionName?: string;
    GraduationYear?: number;
    GPA?: number | null;
  }) {
    return apiCall<ApiResponse>(`/education/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: number) {
    return apiCall<ApiResponse>(`/education/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// AVAILABILITY API
// ============================================
export const availabilityApi = {
  async getAll() {
    return apiCall<ApiResponse>('/availability');
  },

  async create(data: {
    FreelancerID: number;
    CurrentProjectsCount?: number;
    ActivityStatus?: string;
    NextAvailabilityDate?: string | null;
    WeeklyHoursAvailable?: number;
  }) {
    return apiCall<ApiResponse>('/availability', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: {
    CurrentProjectsCount?: number;
    ActivityStatus?: string;
    NextAvailabilityDate?: string | null;
    WeeklyHoursAvailable?: number;
  }) {
    return apiCall<ApiResponse>(`/availability/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// BOOKMARKS API
// ============================================
export const bookmarksApi = {
  async getAll() {
    return apiCall<ApiResponse>('/saved-bookmarked');
  },

  async create(data: {
    FreelancerID: number;
    EmployerID: number;
  }) {
    return apiCall<ApiResponse>('/saved-bookmarked', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async delete(id: number) {
    return apiCall<ApiResponse>(`/saved-bookmarked/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// PROJECTS API (New - for employers)
// ============================================
export const projectsApi = {
  async getAll(params?: {
    status?: string;
    employer_id?: number;
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return apiCall<ApiResponse>(`/projects${queryString}`);
  },

  async getById(id: number) {
    return apiCall<ApiResponse>(`/projects/${id}`);
  },

  async create(data: {
    title: string;
    description: string;
    budget?: number;
    duration?: string;
    experience_needed?: string;
    skills_required?: string[];
    status?: string;
  }) {
    return apiCall<ApiResponse>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: any) {
    return apiCall<ApiResponse>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: number) {
    return apiCall<ApiResponse>(`/projects/${id}`, {
      method: 'DELETE',
    });
  },

  async expressInterest(id: number) {
    return apiCall<ApiResponse>(`/projects/${id}/interest`, {
      method: 'POST',
    });
  },
};

// ============================================
// REVIEWS API (New)
// ============================================
export const reviewsApi = {
  async getForFreelancer(freelancerId: number) {
    return apiCall<ApiResponse>(`/freelancers/${freelancerId}/reviews`);
  },

  async create(data: {
    freelancer_id: number;
    rating: number;
    comment: string;
  }) {
    return apiCall<ApiResponse>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// NOTIFICATIONS API (New)
// ============================================
export const notificationsApi = {
  async getAll() {
    return apiCall<ApiResponse>('/notifications');
  },

  async markAsRead(id: number | string) {
    return apiCall<ApiResponse>(`/notifications/${id}/read`, {
      method: 'POST',
    });
  },

  async markAllAsRead() {
    return apiCall<ApiResponse>('/notifications/read-all', {
      method: 'POST',
    });
  },
};

export default {
  auth: authApi,
  freelancers: freelancersApi,
  employers: employersApi,
  skills: skillsApi,
  portfolio: portfolioApi,
  education: educationApi,
  availability: availabilityApi,
  bookmarks: bookmarksApi,
  projects: projectsApi,
  reviews: reviewsApi,
  notifications: notificationsApi,
};