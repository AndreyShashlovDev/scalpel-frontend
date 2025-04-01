import {
  SINGLETON_MODULE_METADATA_KEY,
  INJECT_METADATA_KEY,
  INJECTABLE_METADATA_KEY,
  MODULE_METADATA_KEY,
  ModuleOptions,
  Scope,
  SCOPE_METADATA_KEY,
  TokenType
} from '../di/Dependency.ts'

export function Module(options: ModuleOptions): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata(MODULE_METADATA_KEY, options, target)
  }
}

export function Injectable(scope: Scope = Scope.SINGLETON): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target)
    Reflect.defineMetadata(SCOPE_METADATA_KEY, scope, target)
  }
}

export function Inject(token: TokenType<unknown>): ParameterDecorator {
  return (target: Object, _: string | symbol | undefined, parameterIndex: number) => {
    const existingTokens = Reflect.getMetadata(INJECT_METADATA_KEY, target) || {}
    existingTokens[parameterIndex] = token
    Reflect.defineMetadata(INJECT_METADATA_KEY, existingTokens, target)
  }
}

export function Singleton(): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata(SINGLETON_MODULE_METADATA_KEY, true, target)
  }
}
