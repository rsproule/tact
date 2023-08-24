import ReactMarkdown from "react-markdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function Rules() {
  const markdown = ` 
* When joining players are randomly placed on the board with 3 lives and 1 action point (AP). They must pay the entry fee if there is one
              (configurable).
* Every epoch (30 min default, configurable) every player is given an AP.
* APs can be spent at any time in the following ways:

      1. Move to an adjacent hexagon (1 AP)
      2. Shoot a tank within range (1 AP). Removes 1 heart.
      3. Upgrade your range (the cost of the upgrade is equal to the new perimeter of the range plus 10%)
      
* Tanks can shoot or trade with (give APs or hearts) any other tanks
that are in range
* Initially, all tanks have range of 3
(configurable).
* Player are dead whenever they have 0 hearts.
* Dead players can be revived by someone who sends them a heart (they
do not accumulate APs during the time they are dead)
* once a day a heart spawns randomly on the field, whoever goes to that square
earns a heart
* Dead players form a cursing jury who can vote on who to curse (take ap) once per epoch
  `;

  return (
    <div className="container py-3">
      <Card>
        <CardHeader>
          <CardTitle>Tact Rules</CardTitle>
          <CardDescription>
            A game of trust in an environment of no trust. Bring your own trust:
            BYOT.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReactMarkdown className="markdown">{markdown}</ReactMarkdown>
        </CardContent>
        <CardFooter>
          <a
            className="text-blue-600 visited:text-purple-600"
            href="https://github.com/rsproule/tanks"
          >
            View project on Github
          </a>
          <br />
          {/* <a
            className="text-blue-600 visited:text-purple-600"
            href="https://goerli.etherscan.io/address/0x0a8628a32f0AC3A208B8CEf032B38fF08bB140D7"
          >
            View Contract on Block Explorer
          </a> */}
        </CardFooter>
      </Card>
    </div>
  );
}
