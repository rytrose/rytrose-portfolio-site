import { useReducer, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { isEmpty } from "../utils/object";

const VISITOR_KEY = "rytrose-visitor";

const reducer = (visitor, action) => {
  // console.log("dispatch", visitor, action);
  switch (action.type) {
    case "init":
      return { ...action.visitor };
    case "load":
      return { ...action.stored };
    case "setID":
      return { ...visitor, id: action.id };
    case "setPaint":
      return { ...visitor, paint: action.paint };
    case "setLastPainted":
      return { ...visitor, lastPainted: action.lastPainted };
    case "test":
      return { ...visitor, test: "" };
    default:
      throw new Error(`unknown visitor action: ${action}`);
  }
};

const useVisitor = () => {
  const [visitor, dispatch] = useReducer(reducer, {});
  const visitorRef = useRef();

  useEffect(() => {
    const stored = localStorage.getItem(VISITOR_KEY);
    if (!!stored) {
      dispatch({ type: "load", stored: JSON.parse(stored) });
    } else {
      dispatch({ type: "init", visitor: { id: uuidv4(), paint: -1 } });
    }
  }, []);

  useEffect(() => {
    visitorRef.current = visitor;
    if (isEmpty(visitor)) return;
    localStorage.setItem(VISITOR_KEY, JSON.stringify(visitor));
  }, [visitor]);

  return [visitor, visitorRef, dispatch];
};

export default useVisitor;
