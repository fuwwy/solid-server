import { createContext } from "solid-js";

export const ServerContext = createContext({} as any);

export function ServerProvider(props) {
  return <ServerContext.Provider value={props}>{props.children}</ServerContext.Provider>;
}