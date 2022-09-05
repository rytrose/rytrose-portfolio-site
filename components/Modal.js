import { useState, useCallback, useEffect } from "react";
import useEventListener from "../hooks/useEventListener";
import Button from "./Button";

const Modal = ({ open, onClose, children }) => {
  // For some reason, useEventListener does not work with just useRef.
  // Instead, populate the element with a callback ref.
  const [dialogElement, setDialogElement] = useState();
  const dialogRef = useCallback((node) => {
    setDialogElement(node);
  }, []);

  useEffect(() => {
    if (!dialogElement) return;
    if (open) {
      // Show dialog to permit opacity transition
      dialogElement.showModal();
      dialogElement.classList.remove("opacity-0");
      document.body.classList.add("overflow-hidden");
    } else {
      dialogElement.classList.add("opacity-0");
      document.body.classList.remove("overflow-hidden");
      // Close dialog after transition ends to permit opacity transition
    }
  }, [open, dialogElement]);

  useEventListener(
    "transitionend",
    (e) => {
      if (e.target == dialogElement && dialogElement.open) {
        // Dialog will be open for both fade in and out,
        // but only close the dialog when fading out
        if (e.target.classList.contains("opacity-0")) e.target.close();
      }
    },
    dialogElement
  );

  return (
    <dialog
      ref={dialogRef}
      className={`flex flex-col transition duration-[400ms] opacity-0 backdrop:bg-slate-800 backdrop:opacity-80 rounded-xl overflow-hidden`}
      onCancel={(e) => e.preventDefault()}
    >
      <div className="flex font-serif text-sm h-8 overflow-hidden">
        <div className="grow"></div>
        <Button onClick={onClose}>close</Button>
      </div>
      <div className="overflow-y-auto mt-2">{children}</div>
    </dialog>
  );
};

export default Modal;
