export interface MenuResponse {
  id: string;
  name: string;
  minPreparationTimeInMinutes: number;
  maxPreparationTimeInMinutes: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateMenuRequest {
  name: string;
  minPreparationTimeInMinutes: number;
  maxPreparationTimeInMinutes: number;
}
