import 'reflect-metadata'
import { Injectable, Module } from '@di-core/decorator/decorators.ts'
import { moduleManager } from '@di-core/di/Dependency.ts'
import { OnDisposeInstance } from '@di-core/di/OnDisposeInstance.ts'
import { preloadModule } from '@di-core/di/preloadModule.ts'
import { beforeEach, describe, expect, test, vi } from 'vitest'

describe('onDisposeInstance Lifecycle', () => {
  beforeEach(() => {
    const moduleRefs = (moduleManager as any).moduleRefs
    if (moduleRefs && moduleRefs instanceof Map) {
      moduleRefs.clear()
    }

    const globalModuleRefs = (moduleManager as any).globalModuleRefs
    if (globalModuleRefs && globalModuleRefs instanceof Map) {
      globalModuleRefs.clear()
    }

    (moduleManager as any).rootModuleRef = null
  })

  test('onDisposeInstance is called when module is unloaded', async () => {
    const onDisposeSpy = vi.fn()

    @Injectable()
    class ServiceWithDispose implements OnDisposeInstance {
      onDisposeInstance(): void {
        onDisposeSpy()
      }
    }

    @Module({
      providers: [
        {provide: 'ServiceWithDispose', useClass: ServiceWithDispose}
      ],
      exports: ['ServiceWithDispose']
    })
    class TestModule {}

    await preloadModule(TestModule, false)

    moduleManager.getService<ServiceWithDispose>(TestModule, 'ServiceWithDispose')

    expect(onDisposeSpy).not.toHaveBeenCalled()

    moduleManager.unloadModule(TestModule)

    expect(onDisposeSpy).toHaveBeenCalledTimes(1)
  })

  test('onDisposeInstance is not called if module cannot be unloaded', async () => {
    const onDisposeSpy = vi.fn()

    @Injectable()
    class ServiceWithDispose implements OnDisposeInstance {
      onDisposeInstance(): void {
        onDisposeSpy()
      }
    }

    @Module({
      providers: [
        {provide: 'ServiceWithDispose', useClass: ServiceWithDispose}
      ],
      exports: ['ServiceWithDispose']
    })
    class TestModule {}

    @Module({
      imports: [TestModule],
      providers: [],
      exports: []
    })
    class RootModule {}

    await preloadModule(RootModule, true)
    moduleManager.unloadModule(TestModule)

    expect(onDisposeSpy).not.toHaveBeenCalled()
  })

  test('Multiple providers with onDisposeInstance in the same module', async () => {
    const onDisposeSpy1 = vi.fn()
    const onDisposeSpy2 = vi.fn()

    @Injectable()
    class Service1WithDispose implements OnDisposeInstance {
      onDisposeInstance(): void {
        onDisposeSpy1()
      }
    }

    @Injectable()
    class Service2WithDispose implements OnDisposeInstance {
      onDisposeInstance(): void {
        onDisposeSpy2()
      }
    }

    @Module({
      providers: [
        {provide: 'Service1', useClass: Service1WithDispose},
        {provide: 'Service2', useClass: Service2WithDispose}
      ],
      exports: ['Service1', 'Service2']
    })
    class TestModule {}

    await preloadModule(TestModule, false)

    moduleManager.getService<Service1WithDispose>(TestModule, 'Service1')
    moduleManager.getService<Service2WithDispose>(TestModule, 'Service2')

    moduleManager.unloadModule(TestModule)

    expect(onDisposeSpy1).toHaveBeenCalledTimes(1)
    expect(onDisposeSpy2).toHaveBeenCalledTimes(1)
  })

  test('onDisposeInstance is not called for providers without the method', async () => {
    const onDisposeSpy = vi.fn()

    @Injectable()
    class ServiceWithDispose implements OnDisposeInstance {
      onDisposeInstance(): void {
        onDisposeSpy()
      }
    }

    @Injectable()
    class ServiceWithoutDispose {
    }

    @Module({
      providers: [
        {provide: 'ServiceWithDispose', useClass: ServiceWithDispose},
        {provide: 'ServiceWithoutDispose', useClass: ServiceWithoutDispose}
      ],
      exports: ['ServiceWithDispose', 'ServiceWithoutDispose']
    })
    class TestModule {}

    await preloadModule(TestModule, false)

    moduleManager.getService<ServiceWithDispose>(TestModule, 'ServiceWithDispose')
    moduleManager.getService<ServiceWithoutDispose>(TestModule, 'ServiceWithoutDispose')

    moduleManager.unloadModule(TestModule)

    expect(onDisposeSpy).toHaveBeenCalledTimes(1)
  })

  test('onDisposeInstance for factory providers', async () => {
    const onDisposeSpy = vi.fn()

    @Module({
      providers: [
        {
          provide: 'FactoryService',
          useFactory: () => ({
            someMethod: () => 'factory service',
            onDisposeInstance: () => onDisposeSpy()
          })
        }
      ],
      exports: ['FactoryService']
    })
    class TestModule {}

    await preloadModule(TestModule, false)

    const service = moduleManager.getService<any>(TestModule, 'FactoryService')
    expect(service.someMethod()).toBe('factory service')

    moduleManager.unloadModule(TestModule)

    expect(onDisposeSpy).toHaveBeenCalledTimes(1)
  })

  test('onDisposeInstance with custom cleanup behavior', async () => {
    const mockResource = {
      isOpen: true,
      close() {
        this.isOpen = false
      }
    }

    @Injectable()
    class ResourceService implements OnDisposeInstance {
      constructor() {
        mockResource.isOpen = true
      }

      useResource() {
        return mockResource.isOpen ? 'resource is open' : 'resource is closed'
      }

      onDisposeInstance(): void {
        mockResource.close()
      }
    }

    @Module({
      providers: [
        {provide: ResourceService, useClass: ResourceService}
      ],
      exports: [ResourceService]
    })
    class ResourceModule {}

    await preloadModule(ResourceModule, false)

    const service = moduleManager.getService<ResourceService>(ResourceModule, ResourceService)
    expect(service.useResource()).toBe('resource is open')
    expect(mockResource.isOpen).toBe(true)

    moduleManager.unloadModule(ResourceModule)

    expect(mockResource.isOpen).toBe(false)
  })
})
