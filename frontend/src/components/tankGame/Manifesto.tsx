import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function Manifesto() {
  return (
    <div className="container py-3">
      <Card>
        <CardHeader>
          <CardTitle>Why Tact?</CardTitle>
          <CardDescription>
            “Toys are not really as innocent as they look. Toys and games are
            preludes to serious ideas.” - Charles Eames
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-base mb-4">
            {`Today's world runs on aggressively over-leveraged social bonds and failing 
            institutions that are limiting the scalability of human coordination efforts.
            The ability to make programmable, credible commitments without this fragile social
            layer can unlock the next level of human coordination.`}
          </p>

          <p className="text-base mb-4">
            Human progress has always been limited by the strength of the trust
            we share with each other. The ability to coordinate is what
            separates us from the common beasts of the field.
          </p>

          <h2 className="text-xl font-semibold mb-2">Early Humanity</h2>
          <p className="text-base mb-4">
            In the beginning of humanity, the nuclear family structure unlocked
            the first social structures of trust. This allowed humans to exit
            the caves and develop rudimentary technology. Over time, the family
            structure evolved into tribes, comprised of extended families that
            organized around the combination of blood bonds and a common set of
            beliefs and values. This set the stage for the agricultural
            revolution and the boom of early human civilization.
          </p>

          <p className="text-base mb-4">
            Structures built on social bonds of common beliefs brought us to the
            modern day. Yet, we now find ourselves at a crossroads. Traditional
            institutions that once fortified our trust—like banks, governments,
            and religious organizations—are showing cracks in their foundations.
            Banks are failing, leading to economic collapse; national borders
            are melting away with the new global online society; religious
            organizations are being left behind for modern secular thinking.
            This is the key problem with social bond-driven trust systems: they
            do not scale.
          </p>

          <h2 className="text-xl font-semibold mb-2">A Path Forward</h2>
          <p className="text-base mb-4">
            The only path forward is to replace these failing, unscalable
            sources of trust with truly robust decentralized economic systems
            that infrastructure like blockchains can provide.
          </p>

          <p className="text-base mb-4">
            From families to tribes, from tribes to civilizations, from
            religious organizations to banks and governments, our progression
            has been marked by evolving forms of trust and coordination. Today,
            we see an opportunity to advance to a new stage powered by
            blockchains and demonstrated by Tact.
          </p>

          <h2 className="text-xl font-semibold mb-2">
            Limitations of Online Gaming Today
          </h2>
          <p className="text-base mb-9">
            For generations, online games have been limited in the game
            mechanics that they can explore by the fundamental untrustworthy
            nature of the anonymous opponent on the other side of the network
            link. Some of the most interesting and most popular IRL games like
            Risk, Diplomacy, Mafia, and Catan do not translate to the online,
            anonymous worlds because there is no social cost to betrayal or
            lying.
          </p>

          <p className="text-base mb-4">
            Tact is more than just a game; it is a demonstration of what a world
            can look like utilizing the tools for coordination that a blockchain
            provides. A world that runs on credible economic commitments.
          </p>
        </CardContent>

        <CardFooter>
          <div className="flex w-full space-x-4 justify-center">
            <a
              className="text-white hover:text-gray-400"
              href="https://github.com/rsproule/tanks"
            >
              View project on Github
            </a>
            <a className="text-white hover:text-gray-400" href="/rules">
              Read the Rules
            </a>
            <a className="text-white hover:text-gray-400" href="todo">
              View Contract on Block Explorer
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
