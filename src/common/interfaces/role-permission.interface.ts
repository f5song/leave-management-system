import { ERole } from '../constants/roles.enum';
import { EPermission } from '../constants/permission.enum';

export interface IRolePermission {
    role: ERole[];
    permissions: EPermission[];
}
