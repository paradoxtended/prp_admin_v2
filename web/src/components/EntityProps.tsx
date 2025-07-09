import type { EntityProps as EntityData } from "../typings/open";
import { Locale } from "./store/locale"

const EntityProps: React.FC<{
    entity: EntityData | null;
}> = ({ entity }) => {
    return (
        <div className="entity-wrapper">
          <div className="entity-modal">
            <p className="entity-title">{entity?.model}</p>
            <div className="mt-[10px]">
              <p className="text-[16px] text-white flex
              items-center gap-3">{Locale.ui_coords || 'Coords'}: 
                <span className="prodigy">
                  {entity?.coords.x.toFixed(2)}, {entity?.coords.y.toFixed(2)}, { entity?.coords.z.toFixed(2)}
                </span>
              </p>
              <p className="text-[16px] text-white flex
              items-center gap-3">{Locale.ui_heading || 'Heading'}:
                <span className="prodigy">
                  {entity?.heading.toFixed(3)}
                </span>
              </p>
              <p className="text-[16px] text-white flex
              items-center gap-3">{Locale.ui_model || 'Model'}:
                <span className="prodigy">
                  {entity?.model}
                </span>
              </p>
              <p className="text-[16px] text-white flex
              items-center gap-3">{Locale.ui_network_owner || 'Network owner'}:
                <span className="prodigy">
                  {entity?.networkOwner }
                </span>
              </p>
              {entity?.plate && (
                <p className="text-[16px] text-white flex
                items-center gap-3">{Locale.ui_plate || 'Plate'}:
                  <span className="prodigy">
                    {entity.plate}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
    )
}

export default EntityProps;