import { Module } from 'flexdi'
import { ApplicationRouter } from '../../../common/router/domain/ApplicationRouter.ts'
import { SimulationRepository } from '../data/simulation-repository/SimulationRepository.ts'
import { SimulationRepositoryImpl } from '../data/simulation-repository/SimulationRepositoryImpl.ts'
import { DemoPagePresenter } from '../domain/DemoPagePresenter.ts'
import { DemoPagePresenterImpl } from '../domain/DemoPagePresenterImpl.ts'
import { DemoPageRouter } from '../domain/router/DemoPageRouter.ts'

@Module({
  imports: [],
  providers: [
    {
      provide: SimulationRepository,
      useClass: SimulationRepositoryImpl,
    },
    {
      provide: DemoPageRouter,
      deps: [ApplicationRouter],
      useFactory: (appRouter: ApplicationRouter) => appRouter
    },
    {
      provide: DemoPagePresenter,
      useClass: DemoPagePresenterImpl
    }
  ],
  exports: [DemoPagePresenter]
})
export class DemoPageModule {}
