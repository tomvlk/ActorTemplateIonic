
export interface User {
  $key?: string,

  projects: any,

  name: string,
}

export interface Project {
  $key?: string,
  members: any,

  name: string,
  description: string,
}


