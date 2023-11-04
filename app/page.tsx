import Game from "@/components/Game";
import { parseWorld } from "@/parsers/parseWorld";
import { loadUser } from "@/utils/loadUser";

export default async function Home() {
  const gameWorld = await parseWorld();
  const user = await loadUser();
  return (
    <main className="">
      <Game gameWorld={gameWorld} user={user} />
    </main>
  )
}
