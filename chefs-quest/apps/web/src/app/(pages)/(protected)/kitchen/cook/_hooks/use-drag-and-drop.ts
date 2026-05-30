import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { type RefObject } from "react";
import { IngredientKey, type Ingredient } from "../../_data/ingredients";

type DragPosition = {
  left: number;
  top: number;
};

type UseDragAndDropOptions = {
  potRef: RefObject<HTMLDivElement | null>;
  placedIngredients: IngredientKey[];
  timerExpired: boolean;
  onPlace: (key: IngredientKey) => void;
};

// Hook que gerencia toda a lógica de drag-and-drop via Pointer Events
export function useDragAndDrop({ potRef, placedIngredients, timerExpired, onPlace }: UseDragAndDropOptions) {
  const activeKeyRef = useRef<IngredientKey | null>(null);
  const [draggingKey, setDraggingKey] = useState<IngredientKey | null>(null);
  const [dragPosition, setDragPosition] = useState<DragPosition>({ left: 0, top: 0 });

  // Listeners globais de pointer para acompanhar o drag
  useEffect(() => {
    if (!draggingKey) return;

    function handlePointerMove(event: PointerEvent) {
      event.preventDefault();
      setDragPosition({ left: event.clientX, top: event.clientY });
    }

    function handlePointerUp(event: PointerEvent) {
      const key = activeKeyRef.current;
      const potRect = potRef.current?.getBoundingClientRect();
      const isInsidePot =
        potRect &&
        event.clientX >= potRect.left &&
        event.clientX <= potRect.right &&
        event.clientY >= potRect.top &&
        event.clientY <= potRect.bottom;

      if (isInsidePot && key) {
        onPlace(key);
      }

      activeKeyRef.current = null;
      setDraggingKey(null);
    }

    function handlePointerCancel() {
      activeKeyRef.current = null;
      setDraggingKey(null);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerCancel);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
    };
  }, [draggingKey, onPlace, potRef]);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>, ingredient: Ingredient) {
    if (placedIngredients.includes(ingredient.key) || timerExpired) return;

    event.preventDefault();
    (event.target as HTMLElement).releasePointerCapture?.(event.pointerId);
    activeKeyRef.current = ingredient.key;
    setDraggingKey(ingredient.key);
    setDragPosition({ left: event.clientX, top: event.clientY });
  }

  return { draggingKey, dragPosition, handlePointerDown };
}
