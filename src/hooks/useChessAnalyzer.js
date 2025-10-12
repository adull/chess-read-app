import { useState, useEffect, useCallback } from "react";
import { validatePosition } from "../helpers";

export function useChessAnalyzer({ addPanel, findPanel, openModal }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const [pgn, setPgn] = useState("");

  useEffect(() => {
    if (boxes.length > 0 && !findPanel("hacks")) {
      import("../components/sidebar/Hacks").then(({ default: Hacks }) => {
        addPanel("hacks", Hacks, { boxes, setBoxes });
      });
    }
  }, [boxes, addPanel, findPanel]);

  const validatePositionFromBoxes = useCallback(() => {
    const res = validatePosition(boxes);
    if (res.success) {
      setPgn(res.fullPGN);
      setBoxes(prev => prev.map(b => ({ ...b, isError: false })));
      return;
    }

    if (res.partialPGN) {
      setPgn(res.partialPGN);

      import("../components/sidebar/ValidationErrorPanel").then(({ default: ValidationErrorPanel }) => {
        addPanel("validation-error", ValidationErrorPanel, {
          validationError: res,
          onOpenEditor: () => {
            import("../components/modals/InteractiveEditor").then(({ default: InteractiveEditor }) => {
              openModal(InteractiveEditor, "interactive-editor", {
                size: "large",
                initialPgn: res.partialPGN,
                invalidMoveIndex: res.invalidBoxId
                  ? Math.floor(res.invalidBoxId / 3)
                  : -1,
                onMoveUpdate: (moveData) => {
                  console.log("Move updated:", moveData);
                },
              });
            });
          },
        });
      });
    }

    setBoxes(prev =>
      prev.map(b =>
        b.id === res.invalidBoxId
          ? { ...b, isError: true }
          : { ...b, isError: false }
      )
    );
  }, [boxes, addPanel, openModal]);

  return {
    imageUrl,
    setImageUrl,
    boxes,
    setBoxes,
    pgn,
    setPgn,
    validatePositionFromBoxes,
  };
}
