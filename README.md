[licence-badge]: https://img.shields.io/github/license/rsproule/tanks?color=blue
[licence-url]: https://github.com/rsproule/tanks/blob/master/LICENSE
[actions-badge]: https://github.com/rsproule/tanks/actions/workflows/test.yml/badge.svg
[actions-url]: https://github.com/rsproule/tanks/actions/workflows/test.yml
[twitter-badge]: https://img.shields.io/twitter/follow/sproule_
[twitter-url]: https://twitter.com/sproule_

# Tact - an onchain strategy game

[![MIT licensed][licence-badge]][licence-url]
[![Build Status][actions-badge]][actions-url]
[![Twitter][twitter-badge]][twitter-url]

> A game of trust in an environment of no trust.  Bring your own trust: BYOT.

<p align="center">
 <img width="80%" src="assets/tank.jpeg" alt="logo">
</p>

## Motivation

In today's world, we're grappling with the limitations of overstretched social bonds and faltering institutions that constrain our ability to coordinate on a large scale. The advent of programmable, credible commitments that bypass these frail social layers has the potential to usher in a new era of human progress.

Throughout history, the scope of our achievements has been dictated by the strength of trust we share with each other. Coordination is what sets us apart from the beasts of the field; it has been the driving force behind our evolutionary journey.

In the early days of human existence, the nuclear family served as the cornerstone of trust. This foundational social unit allowed us to leave the confines of caves and invent basic tools and technologies. Over time, the family structure evolved into tribes, comprised of extended families. These tribes enhanced our capacity for technological innovation, and laid the foundations for more complex hunting, gathering, and agricultural systems.

Civilization marked another significant milestone. Societal groups formed around shared values and beliefs, creating social contracts of trust similar to how Ethereum's Virtual Machine (EVM) paved the way for programmable, on-chain agreements.

Yet, we now find ourselves at a crossroads. Traditional institutions that once fortified our trust—like banks, governments, and religious organizations—are showing cracks in their foundations. The erosion of faith in these institutions, along with the globalization of society and the rise of secularism, necessitate a new paradigm. The way forward lies in robust, decentralized economic systems that technologies like blockchain can facilitate.

From families to tribes, from religious organizations to banks and governments, our progression has been marked by evolving forms of trust and coordination. Today, we see an opportunity to advance to a new stage we might call "Tact."

Consider online gaming as an analogy. Historically, the scope of game mechanics has been limited due to the inherently untrustworthy nature of anonymous online opponents. Games that thrive on social interaction and trust, like Risk, Diplomacy, Mafia, and Catan, fail to translate well into online environments where there are no real-world consequences for deception or betrayal.

The advent of blockchain technology, equipped with smart contracts, offers a solution. It provides a programmable layer of trust, enabling us to form reliable bonds without the need for complex social intermediaries.

"Tact" is more than just a game; it's a case study for a world built on the foundation that blockchain offers—a world driven by credible economic commitments. It shows us what is possible when we employ the coordination tools that a decentralized infrastructure can provide, potentially revolutionizing how we organize and trust one another.`;

## Version 2 Rules

- When joining players are randomly placed on the board with 3 lives and 1 action point (AP). They must pay the entry fee if there is one (configurable).
- Every epoch (30 min default, configurable) every player is given an AP.
- APs can be spent at any time in the following ways:

  - Move to an adjacent hexagon (1 AP)
  - Shoot a tank within range (1 AP). Removes 1 heart.
  - Upgrade your range (the cost of the upgrade is equal to the new perimeter of the range plus 10%)

- Tanks can shoot or trade with (give APs or hearts) any other tanks that are in range

- Initially, all tanks have range of 3 (configurable).
- Player are dead whenever they have 0 hearts.
- Dead players can be revived by someone who sends them a heart (they do not accumulate APs during the time they are dead)
- once a day a heart spawns randomly on the field, whoever goes to that square earns a heart
- Dead players form a "cursing jury" who can vote on who to curse (take ap) once per epoch
