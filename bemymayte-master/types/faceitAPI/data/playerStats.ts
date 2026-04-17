// оставляю здесь строки, т к иначе придется парсить по трем уровням вложенности
// в api.getMatchStats... лучше в ручке с нашей стороны отдельно сконвертить эти поля
export interface IPlayerMatchStats {
  Result: string
  Kills: string
  Deaths: string
  Assists: string
  'K/D Ratio': string
  Headshots: string
}

export interface IPlayerStats {
  'Average K/D Ratio': number
  'Average Headshots %': number
  'Total Headshots %': number
  'Win Rate %': number
  Matches: number
}
