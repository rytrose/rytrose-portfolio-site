import { useState } from "react";
import Button from "../Button";
import Modal from "../Modal";

const ProjectCard = ({ title, date, icon, modal, children }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="first:mt-0 mt-8 lg:first:mt-4 lg:-mt-16 lg:even:ml-[55%] lg:odd:w-[45%]">
      <div
        className="absolute w-10 h-10 -ml-5 rounded-full border-[1px] border-slate-300 bg-white
        text-center text-xl
        left-8
        sm:left-12
        lg:left-1/2"
      >
        <i
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fa-solid fa-${icon}`}
        />
      </div>
      <div className="inline-block rounded-xl border-[1px] ml-8 sm:ml-0 p-4 border-slate-300">
        <div className="flex font-serif items-center">
          <span className="grow text-lg">{title}</span>
          <span className="text-sm">{date}</span>
        </div>
        <div className="text-sm mt-2">{children}</div>
        {!!modal && (
          <div className="flex font-serif text-md mt-2">
            <div className="grow" />
            <Button onClick={() => setShowModal(true)}>more</Button>
          </div>
        )}
      </div>
      {!!modal && (
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          {modal}
        </Modal>
      )}
    </div>
  );
};

export default ProjectCard;
