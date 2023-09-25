export default abstract class Model {
  constructor(data: any);
  constructor(data: any[]);
  constructor(data: any) {}

  toArray(): any[] {
    return [];
  }
}
