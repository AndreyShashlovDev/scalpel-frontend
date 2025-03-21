import { inject, injectable, singleton } from 'tsyringe'
import { resolveNameProvider, TokenType } from '../di/Dependency.ts'

export const Inject = <T>(token: TokenType<T>) => inject(resolveNameProvider(token))

export const Injectable = injectable

export const Singleton = singleton
