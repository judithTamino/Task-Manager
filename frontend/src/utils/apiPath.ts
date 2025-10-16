export const BASE_URL = 'http://localhost:8000';

export const API_PATHS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    GET_USER: '/api/auth/profile',
  },

  USERS: {
    GET_ALL_USERS: '/api/users',
    GET_USER_BY_ID: (userId: string) => `/api/users/${userId}`,
    CREATE_USER: '/api/users',
    DELETE_USER: (userId: string) => `/api/users/${userId}`,
  },

  TASK: {
    GET_ADMIN_DASHBOARD: '/api/tasks/dashboard',
    GET_USER_DASHBOARD: '/api/tasks/dashboard/user',
    GET_ALL_TASKS: '/api/tasks',
    GET_TASK_BY_ID: (taskId: string) => `/api/tasks/${taskId}`,
    CREATE_TASK: (taskId: string) => `/api/tasks/${taskId}`,
    DELETE_TASK: (taskId: string) => `/api/tasks/${taskId}`,

    UPDATE_TASK_STATUS: (taskId: string) => `/api/tasks/${taskId}/status`,
    UPDATE_TODO_CHECKLIST: (taskId: string) => `/api/tasks/${taskId}/todo`,
  },

  REPORTS: {
    EXPORT_TASKS: '/api/reports/export/tasks',
    EXPORTS_USERS: '/api/reports/export/users',
  },

  IMAGE: {
    UPLOAD_IMAGE: '/api/auth/upload-image',
  },
};
