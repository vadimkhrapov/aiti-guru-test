import type { LoginResponse } from '@/entities/user/model/types';
import { apiRequest } from '@/shared/api/base';

export interface LoginParams {
  username: string;
  password: string;
  expiresInMins?: number;
}

export async function login(params: LoginParams): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    data: {
      username: params.username,
      password: params.password,
      expiresInMins: params.expiresInMins ?? 60,
    },
  });
}
