export class AccountResponseDto {
    id: string;
    userId: string;
    googleId: string;
    email: string;
    approvedById?: string;
    createdAt: Date;
    updateTime: Date;
    deleteTime?: Date;
    approvedAt?: Date;
  }