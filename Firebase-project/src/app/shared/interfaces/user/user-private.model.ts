export class UserPrivate {

  constructor(
    public email: string = 'test@email.com',
    public uid: string = 'uid',
  ) {}

  public static toFirestore = (user: UserPrivate): any => {
    return {
      email: user.email,
      uid: user.uid,
    };
  }

  public static fromFirestore = (data: any): UserPrivate => {
    return new UserPrivate(data.email, data.uid);
  }
}
