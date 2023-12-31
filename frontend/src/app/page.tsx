import Link from "next/link";
import { Button } from "../components/ui/button";
import { Connected } from "../components/wagmi/Connected";
import Manifesto from "../components/tankGame/Manifesto";
export default function HomePage() {
  return (
    <div className="grid container mx-auto p-4">
      <Connected>
        <div className="flex justify-center items-center my-4">
          <Link href="/games">
            <Button className="text-center">Play Now</Button>
          </Link>
        </div>
      </Connected>
      <Manifesto />
    </div>
  );
}
