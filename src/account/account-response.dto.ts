export class AccountResponseDto {
    id: number;
    user_id: number;
    google_id: string;
    email: string;
    approved_by?: number;
    created_at: Date;
    updated_at: Date;
  }
  