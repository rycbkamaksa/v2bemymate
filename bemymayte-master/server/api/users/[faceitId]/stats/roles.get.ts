import { RoleEnum } from '~/types/bemymateAPI/roles'
import { Stat } from '~/server/models/stat'
import { useQuery } from 'h3'

// эндпоинт возвращает статистику игрока по ролям
export default defineEventHandler(async (event) => {
  const { faceitId } = event.context.params

  // параметр only позволяет выбрать конкретные роли для извлечения статистики,
  // без него возвращается статистика по всем ролям
  const { only } = useQuery(event)
  let rolesToCollect = [...Object.keys(RoleEnum)]
  if (only) {
    rolesToCollect = String(only).split(':')
  }

  return Stat.findOne({ guid: faceitId }, rolesToCollect.join(' ')).exec()
})
