import { Module } from '../../utils/di-core/di/Dependency.ts'
import { ApplicationRouter } from '../router/domain/ApplicationRouter.ts'
import { ApplicationRouterImpl } from '../router/domain/ApplicationRouterImpl.ts'
import { MemoryRouteStateManagerImpl } from '../router/domain/state-manager/MemoryRouteStateManagerImpl.ts'
import { RouteStateManager } from '../router/domain/state-manager/RouteStateManager.ts'

@Module({
  providers: [
    {
      provide: RouteStateManager,
      useClass: MemoryRouteStateManagerImpl
    },
    {
      provide: ApplicationRouter,
      useClass: ApplicationRouterImpl
    }
  ],
  exports: [ApplicationRouter]
})
export class RouterModule {}
