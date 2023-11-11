import Game from "@/components/Game";
import { parseWorld } from "@/parsers/parseWorld";
import { loadUser } from "@/utils/loadUser";

export default async function Home() {
  const user = await loadUser();
  const gameWorld = await parseWorld(999, user);
  return (
    <main className="">
      <Game gameWorld={gameWorld} user={user} />
    </main>
  )
}
