import type { H3Error } from 'h3'
import { RemapToSnakeKeys } from '~/types/utils'

export function RouteMatches(route:string, patterns:Array<RegExp>): boolean {
  for (const pattern of patterns) {
    if (pattern.test(route)) {
      return true;
    }
  }

  return false;
}

// В качестве параметра принимает возвращаемый тип, обернутый в промис (асинхронное выполнение), либо нет (синхронное)
// В случае ошибки возвращает значение из handler
export function wrapError<T extends Promise<any> | any>(fn: (() => T) | T, handler: (err: Error | H3Error) => any): T {
  if (fn instanceof Promise) {
    // иф гарантирует, что сюда попадает только промис, но для ts это неявно
    // @ts-ignore
    return fn.catch(handler)
  }

  // для синхронного случая - оборачиваем вызов в try-catch
  try {
    // соответственно тут только синхронная функция
    // @ts-ignore
    return fn()
  } catch (err) {
    return handler(err)
  }
}

// Принимает объект и возвращает тот же объект, с ключами, приведенными к snake_case,
// опционально принимает функция преобразования ключей remapFunc
export function RemapObjectToSnakeKeys<T>(obj: T, remapFunc: Function = (val) => val) {
  const remappedObj = {} as RemapToSnakeKeys<T>
  for (const [key, val] of Object.entries(obj)) {
    remappedObj[key.toLowerCase().replace(/\s/g, '_')] = remapFunc(val)
  }

  return remappedObj
}
