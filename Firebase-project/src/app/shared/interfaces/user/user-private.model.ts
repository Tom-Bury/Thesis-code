export class UserPrivate {

  constructor(
    public email: string = 'test@email.com',
    public uid: string = 'uid',
    public hasForumAccess = true
  ) {}

  public static toFirestore = (user: UserPrivate): any => {
    return {
      email: user.email,
      uid: user.uid,
      hasForumAccess: user.hasForumAccess
    };
  }

  public static fromFirestore = (data: any): UserPrivate => {
    const forumAccess = data.hasForumAccess ? true : false;
    return new UserPrivate(data.email, data.uid, forumAccess);
  }
}
