import { Module } from '../../utils/di-core/di/Dependency.ts'
import { NotificationRepository } from '../repository/data/notification/NotificationRepository.ts'
import { NotificationRepositoryImpl } from '../repository/data/notification/NotificationRepositoryImpl.ts'
import { PushNotificationService } from '../service/notification/PushNotificationService.ts'
import { PushNotificationServiceImpl } from '../service/notification/PushNotificationServiceImpl.ts'
import { SourceModule } from './SourceModule.ts'
import { SWModule } from './SWModule.ts'

@Module({
  imports: [SourceModule, SWModule],
  providers: [
    {
      provide: NotificationRepository,
      useClass: NotificationRepositoryImpl
    },
    {
      provide: PushNotificationService,
      useClass: PushNotificationServiceImpl
    }
  ],
  exports: [PushNotificationService]
})
export class NotificationModule {}
