
export interface User {
  $key?: string,

  projects: {[key: string]: any},

  name: string,
}

export interface Project {
  $key?: string,
  members: Object,

  name: string,
  description: string,

  templates?: {[key: string]: ActorTemplate},
  persons?: {[key: string]: Person},
}

export interface ActorTemplate {
  $key?: string,

  name: string,
  description: string,
  archived: boolean,

  persons?: any,
}

export interface Person {
  $key?: string,

  name: string,
  photo: string,
  function: string,
  email: string,
  phone: string,
  description: string,
}
