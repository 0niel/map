import { Button } from '../ui/button'
import clsx from 'clsx'

interface FloorSelectorButtonsProps {
  floors: number[]
  selectedFloor: number
  onFloorSelect: (floor: number) => void
}

const FloorSelectorButtons: React.FC<FloorSelectorButtonsProps> = ({
  floors,
  selectedFloor,
  onFloorSelect
}) => {
  return (
    <div className="dark-hover:bg-gray-700 dark-active:text-white flex w-12 flex-col space-y-1 rounded-lg border border-input bg-background p-1.5 dark:text-white sm:w-full sm:space-y-2 sm:p-2">
      {floors.map(floor => (
        <Button
          variant={floor === selectedFloor ? 'default' : 'secondary'}
          key={floor}
          type="button"
          className={clsx(
            'pointer-events-auto transition duration-150 ease-in-out sm:p-2'
            // {
            //   'bg-primary/70 text-white hover:bg-primary/85 focus:ring-primary/50':
            //     floor === selectedFloor
            // }
          )}
          onClick={() => onFloorSelect(floor)}
        >
          {floor}
        </Button>
      ))}
    </div>
  )
}

export default FloorSelectorButtons
