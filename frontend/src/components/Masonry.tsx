import { ReactNode } from "react";


export default function Masonry({ children }: { children: ReactNode }) {
  const items = Array.isArray(children) ? children : [children];
  return (
    <div className="columns-1 sm:columns-2 xl:columns-3 gap-6 [column-fill:_balance]">
      {items.map((c, i) => (
        <div key={i} className="mb-6 break-inside-avoid-column">
          {c}
        </div>
      ))}
    </div>
  ); 
}
