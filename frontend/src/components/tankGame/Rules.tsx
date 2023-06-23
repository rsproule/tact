import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function Rules() {
  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Tank Turn Tactics Rules</CardTitle>
          <CardDescription>
            A game of trust in an environment of no trust. Bring your own trust:
            BYOT.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc">
            <li>
              initialize: all players are randomly placed on the board with 3
              lives and 3 APs.
            </li>
            <li>
              every <em>epoch</em> (4 hours) every player is given an AP.
            </li>
            <li>
              APs can be spent whenever you like in the following ways:
              <ul className="list-none indent-8">
                <li>- Move to an adjacent square (1 AP)</li>
                <li>- Shoot a tank within range (1 AP). Removes 1 heart.</li>
                <li>- Buy a heart (1 AP)</li>
                <li>- Upgrade your range (3 APs)</li>
              </ul>
            </li>
            <li>
              Tanks can shoot or trade with any other tanks that are in range
            </li>
            <li>Initially, all tanks have range of 3.</li>
            <li>Player are dead whenever they are shot with 0 hearts.</li>
            <li>The player who lays the killing blow is takes all the APs</li>
            <li>players can send hearts or APs as gifts to anyone in range</li>
            <li>
              Dead players can be revived by someone who sends them a heart
              (they will have 1 heart and 0 AP)
              <ul>
                <li>
                  not sure how range impacts this (do they have to be in range
                  of their death? probably)
                </li>
              </ul>
            </li>
          </ul>
          {/* <h3 id="jury-rules">Jury rules</h3>
          <ul>
            <li>dead players form a jury</li>
            <li>
              once per epoch, the jury decides which player to &quot;curse&quot;
              which prevents them from earning an AP that day
            </li>
          </ul>
          <h3 id="notes-on-on-chain-issues">Notes on on-chain issues</h3>
          <ul>
            <li>
              sophisticated actors can put in all their actions before humans
              have time to react
              <ul>
                <li>either allow this to become a mev game</li>
                <li>
                  or put a timer in where there is only one global action
                  allowed per 5 mins or something
                </li>
              </ul>
            </li>
            <li>
              action points are supposed to be secret
              <ul>
                <li>on-chain privacy stuff, could do a tornado style pool -</li>
              </ul>
            </li>
          </ul> */}
        </CardContent>
      </Card>
    </div>
  );
}
