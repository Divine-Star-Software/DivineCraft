import { Observable } from "@amodx/core/Observers";

export class ItemSearchManager {
  static search: string = "";
  static searchNodes: string[] = [];
  static searchUpdated = new Observable();
  static filterAdded = new Observable<any>();
  static filterRemoved = new Observable<any>();
  static filtersUpdated = new Observable();
  static filters: [id: string, value: any][] = [];

  static updateSearch(search: string) {
    this.search = search;
    this.searchNodes = search
      .split(" ")
      .map((_) => _.trim().toLocaleLowerCase());
    this.searchUpdated.notify();
  }


  static createFilter(id:string,value:any)  : [id:string,value:any] {
    return [id,value];
  }

  static setFilter(v:[id:string,value:any]) {
    this.filters.push(v);
    this.filterAdded.notify(v);
    this.filtersUpdated.notify();
    return v;
  }

  static removeFilter(v: any) {
    const i = this.filters.findIndex((_) => _ == v);
    if (i < 0) return;
    this.filters.splice(i,1);
    this.filterRemoved.notify(v);
    this.filtersUpdated.notify();
  }
}
