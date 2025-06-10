import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JobTitleEntity } from "../entity/job-titles.entity";
import { DepartmentEntity } from "../entity/departments.entity";
import { UserEntity } from "../entity/users.entity";
import { RoleEntity } from "../entity/roles.entity";
import { UsersFacilityRequestEntity } from "../entity/users-facility-requests.entity";
import { UsersItemRequestEntity } from "../entity/users-items-requests.entity";
import { UsersItemEntity } from "../entity/users-items.entity";
import { UsersItemsRequestsHistoryEntity } from "../entity/users-items-requests-histories.entity";
import { HolidayEntity } from "../entity/holidays.entity";
import { LeaveEntity } from "../entity/leaves.entity";
import { LeaveTypeEntity } from "../entity/leave-types.entity";
import { PermissionEntity } from "../entity/permissions.entity";
import { In, Repository } from "typeorm";
import { departmentsSeedData } from "./department";
import { jobTitlesSeedData } from "./job-titles";
import { leaveTypesSeedData } from "./leave-types";
import { leavesSeedData } from "./leaves";
import { permissionsSeedData } from "./permissions";
import { rolesSeedData } from "./roles";
import { usersFacilityRequestsSeedData } from "./users-facility-requests";
import { usersItemsRequestsHistorySeedData } from "./users-items-requests-histories";
import { usersItemRequestsSeedData } from "./users-items-requests";
import { usersItemsSeedData } from "./users-items";
import { usersSeedData } from "./users";
import { holidaysSeedData } from "./holidays";
import { permissionRoleSeedData } from "./permission-role";
import { PermissionRoleEntity } from "../entity/permission-role";


@Injectable()
export class SeedService {
    private readonly logger = new Logger(SeedService.name);
    constructor(
        @InjectRepository(DepartmentEntity)
        private readonly departmentRepository: Repository<DepartmentEntity>,
        @InjectRepository(HolidayEntity)
        private readonly holidayRepository: Repository<HolidayEntity>,
        @InjectRepository(JobTitleEntity)
        private readonly jobTitleRepository: Repository<JobTitleEntity>,
        @InjectRepository(LeaveTypeEntity)
        private readonly leaveTypeRepository: Repository<LeaveTypeEntity>,
        @InjectRepository(LeaveEntity)
        private readonly leaveRepository: Repository<LeaveEntity>,
        @InjectRepository(PermissionEntity)
        private readonly permissionRepository: Repository<PermissionEntity>,
        @InjectRepository(RoleEntity)
        private readonly roleRepository: Repository<RoleEntity>,
        @InjectRepository(UsersFacilityRequestEntity)
        private readonly facilityRequestRepository: Repository<UsersFacilityRequestEntity>,
        @InjectRepository(UsersItemsRequestsHistoryEntity)
        private readonly itemRequestHistoryRepository: Repository<UsersItemsRequestsHistoryEntity>,
        @InjectRepository(UsersItemRequestEntity)
        private readonly itemRequestRepository: Repository<UsersItemRequestEntity>,
        @InjectRepository(UsersItemEntity)
        private readonly itemRepository: Repository<UsersItemEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(PermissionRoleEntity)
        private readonly permissionRoleRepository: Repository<PermissionRoleEntity>,
    ) { }


    async seed() {
        this.logger.log('Seeding database...');


        const existingDepartments = await this.departmentRepository.findOne({ where: { deletedAt: null } });
        if (!existingDepartments) {
            const department = await this.departmentRepository.create(departmentsSeedData)
            await this.departmentRepository.save(department)

            const jobTitle = await this.jobTitleRepository.create(jobTitlesSeedData)
            await this.jobTitleRepository.save(jobTitle)
            
            const role = await this.roleRepository.create(rolesSeedData)
            await this.roleRepository.save(role)

            const permission = await this.permissionRepository.create(permissionsSeedData)
            await this.permissionRepository.save(permission)

            const permissionRole = await this.permissionRoleRepository.create(permissionRoleSeedData)
            await this.permissionRoleRepository.save(permissionRole)

            const user = await this.userRepository.create(usersSeedData)
            await this.userRepository.save(user)


            const holiday = await this.holidayRepository.create(holidaysSeedData)
            await this.holidayRepository.save(holiday)

            const leaveType = await this.leaveTypeRepository.create(leaveTypesSeedData)
            await this.leaveTypeRepository.save(leaveType)

            const leave = await this.leaveRepository.create(leavesSeedData)
            await this.leaveRepository.save(leave)

            const facilityRequest = await this.facilityRequestRepository.create(usersFacilityRequestsSeedData)
            await this.facilityRequestRepository.save(facilityRequest)

            const itemRequestHistory = await this.itemRequestHistoryRepository.create(usersItemsRequestsHistorySeedData)
            await this.itemRequestHistoryRepository.save(itemRequestHistory)

            const item = await this.itemRepository.create(usersItemsSeedData)
            await this.itemRepository.save(item)

            const itemRequest = await this.itemRequestRepository.create(usersItemRequestsSeedData)
            await this.itemRequestRepository.save(itemRequest)
        }
        this.logger.log('Seeding database completed');




    }
}