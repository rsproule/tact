import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function Rules() {
  return (
    <div className="py-3 pb-20">
      <Card>
        <CardHeader>
          <CardTitle>Tact Rules</CardTitle>
          <CardDescription>
            A game of trust in an environment of no trust. Bring your own trust:
            BYOT.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Initial Setup</h2>
            <p className="text-base">
              When joining, players are randomly placed on the board with 3
              lives and 1 action point (AP). They must pay the entry fee if
              there is one (configurable).
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Epochs</h2>
            <p className="text-base">
              Every epoch (30 min default, configurable) every player is given
              an AP.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Action Points (APs)</h2>
            <p className="text-base">
              APs can be spent at any time in the following ways:
            </p>
            <ol className="list-decimal list-inside">
              <li>Move to an adjacent hexagon (1 AP)</li>
              <li>Shoot a tank within range (1 AP). Removes 1 heart.</li>
              <li>
                Upgrade your range (the cost of the upgrade is equal to the new
                perimeter of the range plus 10%)
              </li>
            </ol>
            <p className="text-base">
              Tanks can shoot or trade with (give APs or hearts) any other tanks
              that are in range
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Initial Range</h2>
            <p className="text-base">
              Initially, all tanks have a range of 3 (configurable).
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Player Death</h2>
            <p className="text-base">
              Players are dead whenever they have 0 hearts.
            </p>
            <p className="text-base">
              Dead players can be revived by someone who sends them a heart
              (they do not accumulate APs during the time they are dead)
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Special Events</h2>
            <p className="text-base">
              Periodically, a heart spawns randomly on the field; whoever goes
              to that square earns a heart.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Cursing Jury</h2>
            <p className="text-base">
              Dead players form a cursing jury who can vote on who to curse
              (block the claiming of APs) once per epoch.
            </p>
          </section>
        </CardContent>
        <CardFooter>
          <div className="flex w-full space-x-4 justify-center">
            <a
              className="text-white hover:text-gray-400"
              href="https://github.com/rsproule/tanks"
            >
              View project on Github
            </a>
            <a className="text-white hover:text-gray-400" href="/manifesto">
              Read the manifesto
            </a>
            <a
              className="text-white hover:text-gray-400"
              href="https://goerli.etherscan.io/address/0xa28b12ff977cA9969F1f4e3973499fFBe3115835"
            >
              View Contract on Block Explorer
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
