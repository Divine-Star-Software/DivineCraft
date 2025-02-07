import { useRef } from "react";
import { BaseHTMLAttributes } from "react";
import { Observable } from "@amodx/core/Observers";
export function useDragNDrop<Element extends HTMLElement = HTMLElement>(props: {
  drag: boolean;
  drop: boolean;
}) {
  const elementRef = useRef<Element | null>(null);
  const observers = useRef({
    onDrag: new Observable<Element>(),
    onDragEnd: new Observable<Element>(),
    draggedOver: new Observable<[boolean, Element]>(),
    dragStart: new Observable<DataTransfer>(),
    dropped: new Observable<[DataTransfer, DragEvent]>(),
  }).current;
  return [
    observers,
    elementRef,
    {
      draggable: props.drag,
      onDragStart: (event) => {
        if (!props.drag) return;
        event.stopPropagation();
        observers.dragStart.notify(event.dataTransfer);
      },
      onDrag: (event) => {
        if (!props.drag) return;
        event.preventDefault();
        event.stopPropagation();
        observers.onDrag.notify(elementRef.current!);
      },
      onDragEnd: () => {
        if (!props.drag) return;
        observers.onDragEnd.notify(elementRef.current!);
      },
      onDrop: (event) => {
        if (!props.drop) return;
        event.preventDefault();
        event.stopPropagation();
        observers.draggedOver.notify([false, elementRef.current!]);
        observers.dropped.notify([event.dataTransfer, event.nativeEvent]);
      },
      onDragOver: (event) => {
        if (!props.drop) return;
        event.preventDefault();
        event.stopPropagation();
        observers.draggedOver.notify([true, elementRef.current!]);
      },
      onDragLeave: (event) => {
        if (!props.drop) return;
        event.preventDefault();
        event.stopPropagation();
        observers.draggedOver.notify([false, elementRef.current!]);
      },
    } as BaseHTMLAttributes<any>,
  ] as const;
}
