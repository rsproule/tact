import ReactMarkdown from "react-markdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function Manifesto() {
  const markdown = `In today's world, we're grappling with the limitations of overstretched social bonds and faltering institutions that constrain our ability to coordinate on a large scale. The advent of programmable, credible commitments that bypass these frail social layers has the potential to usher in a new era of human progress.

Throughout history, the scope of our achievements has been dictated by the strength of trust we share with each other. Coordination is what sets us apart from the beasts of the field; it has been the driving force behind our evolutionary journey.

In the early days of human existence, the nuclear family served as the cornerstone of trust. This foundational social unit allowed us to leave the confines of caves and invent basic tools and technologies. Over time, the family structure evolved into tribes, comprised of extended families. These tribes enhanced our capacity for technological innovation, and laid the foundations for more complex hunting, gathering, and agricultural systems.

Civilization marked another significant milestone. Societal groups formed around shared values and beliefs, creating social contracts of trust similar to how Ethereum's Virtual Machine (EVM) paved the way for programmable, on-chain agreements.

Yet, we now find ourselves at a crossroads. Traditional institutions that once fortified our trust—like banks, governments, and religious organizations—are showing cracks in their foundations. The erosion of faith in these institutions, along with the globalization of society and the rise of secularism, necessitate a new paradigm. The way forward lies in robust, decentralized economic systems that technologies like blockchain can facilitate.

From families to tribes, from religious organizations to banks and governments, our progression has been marked by evolving forms of trust and coordination. Today, we see an opportunity to advance to a new stage we might call "Tact."

Consider online gaming as an analogy. Historically, the scope of game mechanics has been limited due to the inherently untrustworthy nature of anonymous online opponents. Games that thrive on social interaction and trust, like Risk, Diplomacy, and Catan, fail to translate well into online environments where there are no real-world consequences for deception or betrayal.

The advent of blockchain technology, equipped with smart contracts, offers a solution. It provides a programmable layer of trust, enabling us to form reliable bonds without the need for complex social intermediaries.

"Tact" is more than just a game; it's a case study for a world built on the foundation that blockchain offers—a world driven by credible economic commitments. It shows us what is possible when we employ the coordination tools that a decentralized infrastructure can provide, potentially revolutionizing how we organize and trust one another.`;

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
          <ReactMarkdown className="markdown">{markdown}</ReactMarkdown>
        </CardContent>
      </Card>
    </div>
  );
}
