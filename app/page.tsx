import Game from "@/components/Game";
import { parseWorld } from "@/parsers/parseWorld";
import { loadUser } from "@/utils/loadUser";

export default async function Home() {
  const player = await loadUser();
  const {nodeDict, attackDict, itemDict} = await parseWorld(999, player);

  return (
    <main className="">
      <Game nodeDict={nodeDict} attackDict={attackDict} itemDict={itemDict} player={player} />
    </main>
  )
}
