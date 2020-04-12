import { DBEntry } from '../db-entry.model';

export class ForumPicture extends DBEntry {

  constructor(
    public uid: string,
  ) {
    super();
  }

  public static toFirestore = (pic: ForumPicture): any => {
    return {
      uid: pic.uid,
    };
  }

  public static fromFirestore = (data: any): ForumPicture => {
    const like = new ForumPicture(data.uid);
    like.setCreatedAt(data.createdAt);
    like.setUpdatedAt(data.updatedAt);
    like.setID(data.ID);
    return like;
  }

}
