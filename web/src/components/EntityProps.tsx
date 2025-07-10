import type { EntityProps as EntityData } from "../typings/open";
import { Locale } from "./store/locale"
import SlideUp from "./utils/transitions/SlideUp";

const EntityProps: React.FC<{
    entity: EntityData | null;
}> = ({ entity }) => {
    return (
      <SlideUp in={entity !== null}>
        <div className="flex flex-col gap-1 w-fit font-[Inter] text-[15px] p-3">
          <div className="px-3 py-2 bg-gradient-to-r from-[#000000d0] to-[#000000] rounded border border-transparent flex flex-col relative metadata">
            <p className="text-[#a8a8a8] font-light uppercase">{Locale.ui_model || 'Model'}:</p>
            <p className="text-white font-semibold">{entity?.model}</p>
          </div>
          <div className="px-3 py-2 bg-gradient-to-r from-[#000000d0] to-[#000000] rounded border border-transparent flex flex-col relative metadata">
            <p className="text-[#a8a8a8] font-light uppercase">{Locale.ui_coords || 'Coords'}:</p>
            <p className="text-white font-semibold">{entity?.coords.x.toFixed(2)}, {entity?.coords.y.toFixed(2)}, {entity?.coords.z.toFixed(2)}</p>
          </div>
          <div className="px-3 py-2 bg-gradient-to-r from-[#000000d0] to-[#000000] rounded border border-transparent flex flex-col relative metadata">
            <p className="text-[#a8a8a8] font-light uppercase">{Locale.ui_heading || 'Heading'}:</p>
            <p className="text-white font-semibold">{entity?.heading.toFixed(3)}</p>
          </div>
          <div className="px-3 py-2 bg-gradient-to-r from-[#000000d0] to-[#000000] rounded border border-transparent flex flex-col relative metadata">
            <p className="text-[#a8a8a8] font-light uppercase">{Locale.ui_network_owner || 'Network Owner'}:</p>
            <p className="text-white font-semibold">{entity?.networkOwner}</p>
          </div>
          {entity?.plate && (
            <div className="px-3 py-2 bg-gradient-to-r from-[#000000d0] to-[#000000] rounded border border-transparent flex flex-col relative metadata">
              <p className="text-[#a8a8a8] font-light uppercase">{Locale.ui_plate || 'Plate'}:</p>
              <p className="text-white font-semibold">{entity?.plate}</p>
            </div>
          )}
        </div>
      </SlideUp>
    )
}

export default EntityProps;