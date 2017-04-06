import { Injectable } from '@angular/core';
import { AngularFire } from "angularfire2";
import { Project } from "../app/models";


@Injectable()
export class FireUtils {

  constructor(
    public af: AngularFire,
  ) {

  }

  deleteProject(project: Project) {
    console.log('DELETE!');
    // TODO: Delete project + all related items!
  }

}
