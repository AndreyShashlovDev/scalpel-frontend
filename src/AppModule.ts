import { RouterModule } from './common/di/AppRouterModule.ts'
import { AuthModule } from './common/di/AuthModule.ts'
import { ExceptionModule } from './common/di/ExceptionModule.ts'
import { RepositoryModule } from './common/di/RepositoryModule.ts'
import { SourceModule } from './common/di/SourceModule.ts'
import { AppPageModule } from './feature/app/di/AppPageModule.ts'
import { Module } from './utils/di-core/di/Dependency.ts'

export const SCALPEL_ENDPOINT = import.meta.env.VITE_SCALPEL_ENDPOINT || window.location.origin
export const REOWN_PROJECT_ID = '882d3398012401b6a598b7a245adff21'

@Module({
  imports: [
    ExceptionModule,
    RepositoryModule,
    SourceModule,
    AuthModule,
    RouterModule,
    AppPageModule
  ],
  exports: [
    ExceptionModule,
    RepositoryModule,
    SourceModule,
    AuthModule,
    RouterModule,
    AppPageModule
  ],
})
export class AppModule {}
