import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import Spinner from "~/components/ui/Spinner"
import { Dialog } from "@headlessui/react"
import { fetchSvg } from "./fetchSvg"
import { type MapProps } from "./MapProps"
import { useDisplayModeStore } from "~/lib/stores/displayModeStore"
import ScheduleAPI from "~/lib/schedule/api"
import { useMapStore } from "~/lib/stores/mapStore"
import { type components } from "~/lib/schedule/schema"
import { MapDisplayMode } from "./MapDisplayMode"
import { fillRoom, getAllMapObjectsElements, getMapObjectElementById } from "~/lib/map/domUtils"
import { type MapData } from "~/lib/map/MapData"
import { MapObjectType } from "~/lib/map/MapObject"
import toast from "react-hot-toast"
import { useRoomsQuery } from "~/lib/hooks/useRoomsQuery"
import { useRoomsWorkloadQuery } from "~/lib/hooks/useRoomsWorkloadQuery"
import useScheduleDataStore from "~/lib/stores/scheduleDataStore"
import { useRoomsStatusesQuery } from "~/lib/hooks/useRoomsStatusesQuery"
import { svg } from "d3"

const unactiveGray = "hsl(0, 0%, 80%)"

const createHeatMap = (
  workload: { id: number; workload: number }[],
  rooms: components["schemas"]["Room"][],
  mapData: MapData,
) => {
  for (const mapObjEl of getAllMapObjectsElements()) {
    fillRoom(mapObjEl, unactiveGray)
  }

  for (const room of rooms) {
    const roomMapObject = mapData.objects.find((object) => object.name === room.name)
    if (!roomMapObject) {
      continue
    }

    const mapObject = getMapObjectElementById(roomMapObject.id)
    if (!mapObject) {
      continue
    }

    const roomWorkload = workload.find((workload) => workload.id === room.id)?.workload
    if (!roomWorkload) {
      continue
    }

    // roomWorkload - 0..100, 0 - свободно, 100 - занято
    const red = Math.round((roomWorkload / 100) * 255)
    const green = Math.round(((100 - roomWorkload) / 100) * 165)

    const color = `rgb(${red}, ${green}, 0)`

    fillRoom(mapObject, color)
  }
}

const createStatusesMap = (
  statuses: components["schemas"]["RoomStatusGet"][],
  rooms: components["schemas"]["Room"][],
  mapData: MapData,
) => {
  for (const mapObjEl of getAllMapObjectsElements()) {
    fillRoom(mapObjEl, unactiveGray)
  }

  for (const room of rooms) {
    const roomMapObject = mapData.objects.find((object) => object.name === room.name)
    if (!roomMapObject) {
      continue
    }

    const mapObject = getMapObjectElementById(roomMapObject.id)
    if (!mapObject) {
      continue
    }

    const roomStatus = statuses.find((status) => status.id === room.id)?.status
    if (!roomStatus) {
      continue
    }

    const color = roomStatus === "free" ? "#0E9F6E" : "#F05252"

    fillRoom(mapObject, color)
  }
}

const Map = ({ svgUrl }: MapProps) => {
  const displayModeStore = useDisplayModeStore()
  const { mapData } = useMapStore()

  const { isLoading, data, refetch, status } = useQuery(["map", svgUrl, displayModeStore.mode], {
    queryFn: async () => {
      return await fetchSvg(svgUrl)
    },
    onError: (error) => {
      toast.error("Ошибка при загрузке карты")
    },
  })

  useEffect(() => {
    void refetch().then(() => {
      if (displayModeStore.mode !== MapDisplayMode.DEFAULT || !data) {
        return
      }

      const svgElement = document.querySelector("#map svg") as SVGElement
      svgElement.innerHTML = data
    })
  }, [displayModeStore.mode])

  const { rooms } = useScheduleDataStore()

  const [campusId, setCampusId] = useState<number | undefined>(
    rooms.find((room) => room.campus)?.campus?.id ?? undefined,
  )

  useEffect(() => {
    if (rooms.length > 0) {
      setCampusId(rooms.find((room) => room.campus)?.campus?.id ?? undefined)
    }
  }, [rooms])

  const { isLoading: roomsWorkloadIsLoading, data: roomsWorkloadData } = useRoomsWorkloadQuery(campusId ?? 0, {
    enabled: campusId !== undefined && rooms.length > 0 && displayModeStore.mode === MapDisplayMode.HEATMAP,
    refetchOnWindowFocus: false,
    onError: (error) => {
      toast.error("Ошибка при загрузке нагрузки кабинетов")
    },
  })

  const {
    isLoading: roomsStatusesIsLoading,
    data: roomsStatusesData,
    refetch: refetchRoomsStatuses,
  } = useRoomsStatusesQuery(campusId ?? 0, displayModeStore.timeToDisplay, {
    enabled: campusId !== undefined && rooms.length > 0 && displayModeStore.mode === MapDisplayMode.ROOMS_STATUSES,
    refetchOnWindowFocus: false,
    onError: (error) => {
      toast.error("Ошибка при загрузке статусов кабинетов")
    },
  })

  useEffect(() => {
    const svgElement = document.querySelector("#map svg") as SVGElement

    if (!data || !mapData || !rooms || !svgElement) return

    if (roomsWorkloadData && displayModeStore.mode === MapDisplayMode.HEATMAP) {
      createHeatMap(roomsWorkloadData, rooms, mapData)
    } else if (roomsStatusesData && displayModeStore.mode === MapDisplayMode.ROOMS_STATUSES) {
      createStatusesMap(roomsStatusesData, rooms, mapData)
    }
  }, [data, displayModeStore.mode, mapData, rooms, roomsStatusesData, roomsWorkloadData])

  useEffect(() => {
    if (displayModeStore.mode === MapDisplayMode.ROOMS_STATUSES) {
      void refetchRoomsStatuses()
    }
  }, [displayModeStore.mode, displayModeStore.timeToDisplay, refetchRoomsStatuses])

  return (
    <>
      <Dialog open={isLoading || roomsWorkloadIsLoading || roomsStatusesIsLoading} onClose={() => {}}>
        <div className="absolute left-0 top-0 flex items-center justify-center w-full h-full bg-white opacity-75">
          <Spinner />
        </div>
      </Dialog>

      {data && mapData && <div dangerouslySetInnerHTML={{ __html: data }} id="map" />}
    </>
  )
}

export default Map
