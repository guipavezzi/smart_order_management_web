export enum Status {
  InPreparation = 0,
  Attention = 1,
  Delayed = 2,
  Completed = 3
}

export interface OrderResponse {
  id: string;
  table: number;
  ordered: string;
  createdAt: string;
  status: Status;
  observation: string;
  shiftReference?: string;
  displayedTime? : string;
}