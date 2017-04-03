import {Person} from "./person";

export interface ActorTemplate {
  $key?: string,

  persons: Array<Person>,

  name: string,
  description: string,
  archived: boolean,
}
