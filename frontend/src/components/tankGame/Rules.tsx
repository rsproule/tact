import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function Rules() {
  return (
    <div className="container py-3">
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
              All players are randomly placed on the board with 3 lives and 1
              action point (AP).
            </li>
            <li>
              Every <em>epoch</em> (4 hours) every player is given an AP.
            </li>
            <li>
              APs can be spent whenever you like in the following ways:
              <ul className="list-none indent-8">
                <li>- Move to an adjacent square (1 AP)</li>
                <li>- Shoot a tank within range (1 AP). Removes 1 heart.</li>
                <li>- Upgrade your range (3 APs)</li>
              </ul>
            </li>
            <li>
              Tanks can shoot or trade with any other tanks that are in range
            </li>
            <li>Initially, all tanks have range of 3.</li>
            <li>Player are dead whenever they have 0 hearts.</li>
            <li>players can send hearts or APs as gifts to anyone in range</li>
            <li>
              Dead players can be revived by someone who sends them a heart
              (they will have 1 heart and 0 AP)
            </li>
            <p className="font-medium underline">Rules that are under consideration:</p>
            <ul className="list-none indent-8">
              <li>
                [not implemented] The player who lays the killing blow is takes
                all the APs
              </li>
              <li>
                [not implemented] Players can buy hearts at any time for 3 APs
              </li>
              <li>
                [not implemented] Post death "cursing" jury. Vote on who to curse (take ap/heart)
              </li>
            </ul>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
