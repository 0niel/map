import { MapData } from '@/lib/map/MapData'
import { useMapStore } from '@/lib/stores/mapStore'
import mapDataJson from '@/public/routes.json'
import { useEffect } from 'react'

const loadJsonToGraph = (routesJson: string) => {
  return MapData.fromJson(routesJson)
}

export const useMapData = () => {
  const { setMapData } = useMapStore()

  useEffect(() => {
    const mapData = loadJsonToGraph(JSON.stringify(mapDataJson))
    setMapData(mapData)
  }, [setMapData])
}
