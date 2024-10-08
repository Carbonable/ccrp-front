import { Ndvi } from '@/types/dmrv';
import { useState } from 'react';
import Draggable from 'react-draggable';

export default function TrackingSlider({
  data,
  setSelectedImageIndex,
  selectedDateIndex,
  setSelectedDateIndex,
}: {
  data: Ndvi[];
  setSelectedImageIndex: (index: number) => void;
  selectedDateIndex: number;
  setSelectedDateIndex: (index: number) => void;
}) {
  const [activeDrags, setActiveDrags] = useState(0);
  const [width] = useState((data.length * 8) / 2 - 4);
  const [deltaPosition, setDeltaPosition] = useState({ x: 0, y: 0 });

  const handleDrag = (e: any, ui: { deltaX: number; deltaY: number }) => {
    const { x, y } = deltaPosition;
    setDeltaPosition({
      x: x + ui.deltaX,
      y: y + ui.deltaY,
    });
    setSelectedDateIndex(data.length - (Math.round(x / 8) + 1));
  };

  const onStart = () => {
    setActiveDrags(activeDrags + 1);
  };

  const onStop = () => {
    setActiveDrags(activeDrags - 1);
    setSelectedImageIndex(data.length - (Math.round(deltaPosition.x / 8) + 1));
  };

  const dragHandlers = { onStart, onStop };

  return (
    <div className="mx-auto min-h-[200px] w-full overflow-hidden">
      <Draggable
        bounds={{ top: 0, left: -width, right: width, bottom: 0 }}
        defaultPosition={{ x: -width, y: 0 }}
        {...dragHandlers}
        defaultClassName="w-fit mx-auto min-h-[200px]"
        onDrag={handleDrag}
      >
        <div className="box flex cursor-grab items-end justify-center">
          {data.map((item, index) => (
            <div
              key={`date_${index}`}
              className={`w-[8px] rounded-t-full border-x-[2px] border-t-[2px] border-greenish-700 ${index <= selectedDateIndex ? 'border-greenish-800/80 bg-greenish-500/80' : 'border-neutral-700/70 bg-neutral-500/70'}`}
              style={{ height: `${Math.round(item.value * 100 * 0.9)}px` }}
            ></div>
          ))}
        </div>
      </Draggable>
    </div>
  );
}
