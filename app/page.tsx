import Game from "@/components/Game";
import { parseWorld } from "@/parsers/parseWorld";
import { loadUser } from "@/utils/loadUser";

export default async function Home() {
  const {nodeDict, attackDict, itemDict} = await parseWorld(999);
  const playerData = await loadUser(attackDict,itemDict, nodeDict);

  return (
    <main className="">
      <Game nodeDict={nodeDict} attackDict={attackDict} itemDict={itemDict} playerData={playerData} />
    </main>
  )
}
