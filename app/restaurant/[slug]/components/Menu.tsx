import { Item } from "@prisma/client";
import MenuCard from "./MenuCard";

export default function Menu({menu}: {menu: Item[]}) {

  if (menu.length === 0) {
    return (<div className="text-center mt-5">
              <h1 className="font-bold text-3xl">No items found</h1>
            </div>);
  } 

  return (<main className="bg-white mt-5">
  <div>
    <div className="mt-4 pb-1 mb-1">
      <h1 className="font-bold text-4xl">Menu</h1>
    </div>
    <div className="flex flex-wrap justify-between">
      {/* MENU CARD */}
      {
        menu.map((item) => (
          <MenuCard item={item} />
        ))
      }
      {/* MENU CARD */}
    </div>
  </div>
</main>);
}