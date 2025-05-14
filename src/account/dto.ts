// create-account.dto.ts
export class CreateAccountDto {
    user_id: number;
    google_id: string;
    email: string;
    approved_by?: number;
    approved_at?: Date;
    update_time?: Date;
    delete_time?: Date;
  }
  
  // update-account.dto.ts
  export class UpdateAccountDto {
    google_id?: string;
    email?: string;
    approved_by?: number;
    approved_at?: Date;
    update_time?: Date;
    delete_time?: Date;
  }
  