enum PostCatInner {
  Others = 'Others',
    Energy = 'Energy consumption',
    Checklist = 'Checklist improvements',
    Building = 'Office infrastructure',
    Equipment = 'Office equipment',
    Events = 'Events',
    Temperature = 'Airconditioning & temperature'
}


export class PostCategory {

  constructor(
    private pc: PostCatInner
  ) {}

  public static createPostCategory(name: string): PostCategory {
    switch (name.toLowerCase()) {
      case 'others':
        return new PostCategory(PostCatInner.Others);
      case 'energy':
        return new PostCategory(PostCatInner.Energy);
      case 'checklist':
        return new PostCategory(PostCatInner.Checklist);
      case 'building':
        return new PostCategory(PostCatInner.Building);
      case 'equipment':
        return new PostCategory(PostCatInner.Equipment);
      case 'events':
        return new PostCategory(PostCatInner.Events);
      case 'airco':
        return new PostCategory(PostCatInner.Temperature);
      default:
        console.error('Tried to make a non existing PostCategory: ', name);
        return new PostCategory(PostCatInner.Others);
    }
  }

  public getIconName(): string {
    switch (this.pc) {
      case PostCatInner.Others:
        return 'ellipsis-h';
      case PostCatInner.Energy:
        return 'bolt';
      case PostCatInner.Checklist:
        return 'tasks';
      case PostCatInner.Building:
        return 'tools';
      case PostCatInner.Equipment:
        return 'desktop';
      case PostCatInner.Events:
        return 'universal-access';
      case PostCatInner.Temperature:
        return 'temperature-low';
      default:
        console.error('Unimplemented icon for PostCategory: ', this.pc);
        return 'ellipsis-h';
    }
  }

  public toString(): string {
    return this.pc;
  }
}
