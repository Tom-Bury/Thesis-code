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
      case 'energy consumption':
        return new PostCategory(PostCatInner.Energy);

      case 'checklist':
        return new PostCategory(PostCatInner.Checklist);
      case 'checklist improvements':
        return new PostCategory(PostCatInner.Checklist);

      case 'building':
        return new PostCategory(PostCatInner.Building);
      case 'office infrastructure':
        return new PostCategory(PostCatInner.Building);

      case 'equipment':
        return new PostCategory(PostCatInner.Equipment);
      case  'office equipment':
        return new PostCategory(PostCatInner.Equipment);

      case 'events':
        return new PostCategory(PostCatInner.Events);

      case 'airco':
        return new PostCategory(PostCatInner.Temperature);
      case  'airconditioning & temperature':
        return new PostCategory(PostCatInner.Temperature);
      default:
        console.error('Tried to make a non existing PostCategory: ', name);
        return new PostCategory(PostCatInner.Others);
    }
  }

  public static allCategoryIcons(): string[] {
    return this.allCategoryStrings().map(s => PostCategory.createPostCategory(s)).map(pc => pc.getIconName());
  }

  public static allCategoryStrings(): string [] {
    return Object.values(PostCatInner).map(cat => cat.toString());
  }

  public toFirebaseString(): string {
    switch (this.pc) {
      case PostCatInner.Others:
        return 'others';
      case PostCatInner.Energy:
        return 'energy';
      case PostCatInner.Checklist:
        return 'checklist';
      case PostCatInner.Building:
        return 'building';
      case PostCatInner.Equipment:
        return 'equipment';
      case PostCatInner.Events:
        return 'events';
      case PostCatInner.Temperature:
        return 'airco';
      default:
        console.error('Unimplemented firebase string for PostCategory: ', this.pc);
        return this.pc;
    }
  }

  public toShortString(): string {
    switch (this.pc) {
      case PostCatInner.Others:
        return 'Others';
      case PostCatInner.Energy:
        return 'Energy';
      case PostCatInner.Checklist:
        return 'Checklist';
      case PostCatInner.Building:
        return 'Infrastructure';
      case PostCatInner.Equipment:
        return 'Equipment';
      case PostCatInner.Events:
        return 'Events';
      case PostCatInner.Temperature:
        return 'Temperature';
      default:
        console.error('Unimplemented firebase string for PostCategory: ', this.pc);
        return this.pc;
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
        return 'child';
      case PostCatInner.Temperature:
        return 'temperature-low';
      default:
        console.error('Unimplemented icon for PostCategory: ', this.pc);
        return 'ellipsis-h';
    }
  }

  public getColor(): string {
    switch (this.pc) {
      case PostCatInner.Others:
        return 'light';
      case PostCatInner.Energy:
        return 'warning';
      case PostCatInner.Checklist:
        return 'primary';
      case PostCatInner.Building:
        return 'dark';
      case PostCatInner.Equipment:
        return 'info';
      case PostCatInner.Events:
        return 'success';
      case PostCatInner.Temperature:
        return 'danger';
      default:
        console.error('Unimplemented icon for PostCategory: ', this.pc);
        return 'ellipsis-h';
    }
  }
  public toString(): string {
    return this.pc;
  }


}
