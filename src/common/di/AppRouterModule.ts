import { Module } from '../../utils/di-core/di/Dependency.ts'
import { ApplicationRouter } from '../router/domain/ApplicationRouter.ts'
import { ApplicationRouterImpl } from '../router/domain/ApplicationRouterImpl.ts'

@Module({
  providers: [
    {
      provide: ApplicationRouter,
      useClass: ApplicationRouterImpl
    }
  ],
  exports: [ApplicationRouter]
})
export class RouterModule {}
