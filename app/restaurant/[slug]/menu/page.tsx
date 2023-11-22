import RestaurantNavBar from "../components/RestaurantNavBar";
import Menu from "../components/Menu";
import { Item, PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

const fetchItems = async (slug: string): Promise<Item[]> => {
  
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug
      },
      select: {
        id: true,
        items: true
        }
      }
    );

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    return restaurant.items;
};

export default async function RestaurantMenuPage({ params }: { params: { slug: string } }) {
  
  const menu = await fetchItems(params.slug);

  return (
    
      <div className="bg-white w-[100%] rounded p-3 shadow">
        {/* RESAURANT NAVBAR */}
        <RestaurantNavBar slug={params.slug}/>
        {/* RESAURANT NAVBAR */} {/* MENU */}
        <Menu menu={menu} />
        {/* MENU */}
      </div>


  );
}