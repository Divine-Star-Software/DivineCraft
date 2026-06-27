import { elm } from "@amodx/elm";
import { Items } from "./Items/Items";
import "./ItemSearch.css";

export default function ItemSearch() {
  return elm("div", "item-search", Items());
}
