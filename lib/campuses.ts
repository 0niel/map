'use client'

import config from './config'

export interface Campus {
  shortName: string
  description: string
  floors: number[]
  initialFloor: number
  initialScale: number
  initialPositionX?: number | null | undefined
  initialPositionY?: number | null | undefined
  svgMaps: { [key: string]: string }

  // Корпусы
  buildings?: {
    description?: string,
    name: string,
    floors: number[],
    svgMaps: { [key: string]: string },
    isInitial?: boolean
  }[]
}

const campuses: Campus[] = config.campuses

export const initialCampus = campuses[0] as Campus

export default campuses
