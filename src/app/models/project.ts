import {ActorTemplate} from "./actor-template";

export interface Project {
  $key?: string,
  users: Array<any>,

  name: string,
  description: string,

  actors: Array<ActorTemplate>,
}
