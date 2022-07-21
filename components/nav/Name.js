import { useMemo, useCallback, useState } from "react";
import anime from "animejs";

import useEventListener from "../../hooks/useEventListener";

const Name = () => {
  const [eventElement, setEventElement] = useState();
  const nameRef = useCallback((node) => {
    setEventElement(node);
  }, []);

  // Maps character index in full name to dx for translation to rytrose
  const rytroseChars = useMemo(
    () =>
      new Map([
        [0, 0],
        [1, 0],
        [5, -30],
        [12, -90],
        [13, -90],
        [14, -90],
        [15, -90],
      ]),
    []
  );
  const fullName = "ryan taylor rose";

  const animateMouseEnter = useCallback(
    (_) => {
      if (window.matchMedia("(min-width: 640px)").matches) {
        const letterEls = document.querySelectorAll(
          "*[class*='rytrose-'],.non-rytrose"
        );
        anime.remove(letterEls);
        anime({
          targets: ".non-rytrose",
          translateY: 20,
          opacity: 0,
          easing: "easeOutQuint",
          duration: 300,
        });
        anime({
          targets: "*[class*='rytrose-']",
          translateX: (el) => {
            const i = parseInt(el.id.substring(8));
            return rytroseChars.get(i);
          },
          easing: "easeInQuint",
          duration: 200,
        });
      }
    },
    [rytroseChars]
  );

  const animateMouseLeave = useCallback((_) => {
    if (window.matchMedia("(min-width: 640px)").matches) {
      const els = document.querySelectorAll(
        "*[class*='rytrose-'],.non-rytrose"
      );
      anime.remove(els);
      anime({
        targets: ".non-rytrose",
        translateY: 0,
        opacity: 1,
        easing: "easeInQuint",
        duration: 300,
      });
      anime({
        targets: "*[class*='rytrose-']",
        translateX: 0,
        easing: "easeOutQuint",
        duration: 300,
      });
    }
  }, []);

  useEventListener("mouseenter", animateMouseEnter, eventElement);
  useEventListener("mouseleave", animateMouseLeave, eventElement);

  return (
    <div ref={nameRef} className="font-serif text-2xl whitespace-nowrap">
      {[...fullName].map((letter, i) => {
        return (
          <span
            key={`${i}-${letter}`}
            id={rytroseChars.has(i) ? `rytrose-${i}` : `non-rytrose-${i}`}
            className={`inline-block ${
              rytroseChars.has(i) ? `rytrose-${i}` : "non-rytrose"
            }`}
          >
            {letter === " " ? <>&nbsp;</> : letter}
          </span>
        );
      })}
    </div>
  );
};

export default Name;
