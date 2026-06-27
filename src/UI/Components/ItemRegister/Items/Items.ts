import "./Items.css";
import {
  VoxelIndex,
  VoxelNamedState,
  VoxelNamedStateContainer,
} from "@divinevoxel/vlox/Voxels/Indexes/VoxelIndex";
import { ItemSearchManager } from "../ItemSearchManager";
import { elm, html, useRef } from "@amodx/elm";
import { FuzzySearch } from "@amodx/core/Search/FuzzySearch";
import { useGame } from "UI/Hooks/useGame";
import { ItemDrag } from "../../Inventory/ItemDrag";
import { VoxelTextureIndex } from "@divinevoxel/vlox/Voxels/Indexes/VoxelTextureIndex";
const searchIcon = html(/*html*/ `
 <svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M11.5 21.75C5.85 21.75 1.25 17.15 1.25 11.5C1.25 5.85 5.85 1.25 11.5 1.25C17.15 1.25 21.75 5.85 21.75 11.5C21.75 17.15 17.15 21.75 11.5 21.75ZM11.5 2.75C6.67 2.75 2.75 6.68 2.75 11.5C2.75 16.32 6.67 20.25 11.5 20.25C16.33 20.25 20.25 16.32 20.25 11.5C20.25 6.68 16.33 2.75 11.5 2.75Z"
    fill="#292D32"
  ></path>
  <path
    d="M21.9999 22.7495C21.8099 22.7495 21.6199 22.6795 21.4699 22.5295L19.4699 20.5295C19.1799 20.2395 19.1799 19.7595 19.4699 19.4695C19.7599 19.1795 20.2399 19.1795 20.5299 19.4695L22.5299 21.4695C22.8199 21.7595 22.8199 22.2395 22.5299 22.5295C22.3799 22.6795 22.1899 22.7495 21.9999 22.7495Z"
    fill="#292D32"
  ></path>
</svg> 
`);

function ItemNode({ state }: { state: VoxelNamedState }) {
  const image = VoxelTextureIndex.getImage(state.voxelId, state.data.id);
  return elm(
    "div",
    {
      className: "item-node",
      title: state.data.name || state.data.id,
      draggable: false,
    },
    image && elm("img", { className: "item-image", src: image.src })
  );
}

const getName = (state: VoxelNamedStateContainer) => {
  const data = VoxelIndex.instance.dataMap.get(state.voxelId);
  if (data?.title) return data.title;
  if (data?.name) return data.name;

  if (state.stateArray[0].data.name) return state.stateArray[0].data.name;
  if (state.stateArray[0].data.id) return state.stateArray[0].data.id;
  return state.voxelId;
};

function ItemGroup({ state }: { state: VoxelNamedStateContainer }) {
  const image = VoxelTextureIndex.getImage(
    state.voxelId,
    state.stateArray[0].data.id
  );
  const name = getName(state);
  return elm(
    "div",
    {
      title: name,
      className: `item-group closed`,
      draggable: false,
    },
    image &&
      elm("img", {
        className: "item-image",
        src: image.src,
      })
  );
}

const temp: string[] = [];
class SearchItem {
  searchStrings: string[][];
  constructor(
    public state: VoxelNamedState,
    public element: HTMLDivElement,
    public index: number
  ) {
    this.element.dataset["index"] = String(index);
    const idNodes: string[] = state.data.id
      .split("_")
      .map((_) => _.trim().toLocaleLowerCase());
    idNodes.shift();
    const nameNodes: string[] = state.data.name
      ? state.data.name.split(" ").map((_) => _.trim().toLocaleLowerCase())
      : [];

    const keyWords: string[] = state.tags.has("pvg_keywords")
      ? state.tags.get("pvg_keywords").split(",")
      : [];

    this.searchStrings = [idNodes, nameNodes, keyWords];
  }
  isIncluded() {
    let filtersPass = true;
    if (ItemSearchManager.filters.length != 0) {
      for (const filter of ItemSearchManager.filters) {
        if (
          !this.state.tags.has(filter[0]) ||
          this.state.tags.get(filter[0]) !== filter[1]
        ) {
          filtersPass = false;
          break;
        }
      }
      if (filtersPass) {
        return true;
      }
      if (!filtersPass) return false;
    }

    if (ItemSearchManager.search != "") {
      let found = false;
      for (const search of this.searchStrings) {
        for (const node of search) {
          temp[0] = node;
          found =
            FuzzySearch.fuzzyCloseMatch(
              temp,
              ItemSearchManager.searchNodes,
              0.6
            ) || ItemSearchManager.searchNodes.includes(node);
          if (found) break;
        }
        return found;
      }
    }
    return filtersPass;
  }
  hide() {
    this.element.style.display = "none";
  }
  show() {
    this.element.style.display = "block";
  }
}
class GroupSearchItem {
  epxanded = false;
  groupId: string;
  constructor(
    public stateContainer: VoxelNamedStateContainer,
    public element: HTMLDivElement,
    public children: SearchItem[]
  ) {
    this.groupId = this.stateContainer.voxelId;
    this.element.dataset["group"] = this.groupId;
  }
  toggle() {
    this.setExpanded(!this.epxanded);
  }
  setExpanded(epxanded: boolean) {
    this.epxanded = epxanded;
    if (this.epxanded) {
      this.element.classList.remove("closed");
      this.element.classList.add("expanded");
      for (const child of this.children) {
        child.show();
      }
    } else {
      this.element.classList.add("closed");
      this.element.classList.remove("expanded");
      for (const child of this.children) {
        child.hide();
      }
    }
  }
  hide() {
    this.element.style.display = "none";
  }
  show() {
    this.element.style.display = "block";
    this.setExpanded(this.epxanded);
  }
}

export function Items() {
  const searchRef = useRef<HTMLInputElement>(null);

  const searchItems: SearchItem[] = [];
  const grouopItems = new Map<string, GroupSearchItem>();
  const displayNodes: (SearchItem | GroupSearchItem)[] = [];
  for (const state of VoxelIndex.instance.stateArray) {
    if (state.stateArray.length > 1) {
      const children: SearchItem[] = [];
      for (let i = 0; i < state.stateArray.length; i++) {
        const searchItem = new SearchItem(
          state.stateArray[i],
          ItemNode({ state: state.stateArray[i] }),
          searchItems.length
        );
        searchItem.hide();
        children.push(searchItem);
        searchItems.push(searchItem);
      }
      const groupItem = new GroupSearchItem(
        state,
        ItemGroup({ state }),
        children
      );
      grouopItems.set(state.voxelId, groupItem);
      displayNodes.push(groupItem);
      continue;
    }
    const searchItem = new SearchItem(
      state.stateArray[0],
      ItemNode({ state: state.stateArray[0] }),
      searchItems.length
    );
    searchItems.push(searchItem);
    displayNodes.push(searchItem);
  }

  const updateItems = () => {
    if (!ItemSearchManager.isSearching()) {
      for (const element of searchItems) {
        element.show();
      }
      for (const [, group] of grouopItems) {
        group.show();
      }
      return;
    }
    for (const [, group] of grouopItems) {
      group.hide();
    }
    for (const element of searchItems) {
      const isIncluded = element.isIncluded();
      if (isIncluded) {
        element.show();
      } else {
        element.hide();
      }
    }
  };

  ItemSearchManager.searchUpdated.subscribe(Items, updateItems);
  ItemSearchManager.filtersUpdated.subscribe(Items, updateItems);
  const { items } = useGame().data;

  return elm(
    "div",
    "items",
    elm(
      "div",
      "search",
      elm("input", {
        className: "input",
        type: "text",
        placeholder: "Type here to search",
        ref: searchRef,
        oninput() {
          ItemSearchManager.updateSearch(searchRef.current!.value);
        },
        onkeydown(ev) {
          ev.stopPropagation();
        },
      }),
      elm("div", "search-icon", searchIcon)
    ),
    elm(
      "div",
      {
        className: "nodes",
        draggable: false,
        onwheel(ev) {
          ev.stopPropagation();
        },
        ondrag(ev) {
          ev.preventDefault();
          ev.stopPropagation();
        },
        ondragstart(ev) {
          ev.preventDefault();
          ev.stopPropagation();
        },
        oncontextmenu(ev) {
          ev.preventDefault();
          ev.stopPropagation();
        },
        onpointerdown(ev) {
          if (ev.button !== 0) return;
          const target = ev.target as HTMLElement;
          const itemGroup = elm.findParent(target, "item-group");
          if (itemGroup) {
            const groupId = itemGroup.dataset["group"];
            if (!groupId) return;
            const group = grouopItems.get(groupId);
            group?.toggle();
            return;
          }
          const itemNode = elm.findParent(target, "item-node");
          if (itemNode) {
            const searchItem = searchItems[Number(itemNode.dataset["index"])];
            ItemDrag.Create(
              itemNode,
              items.data.getItemNode(searchItem.state.data.id)!
            );
          }
        },
      },
      displayNodes.map((node) => {
        if (node instanceof SearchItem) return node.element;
        return [node.element, ...node.children.map((_) => _.element)];
      })
    )
  );
}
