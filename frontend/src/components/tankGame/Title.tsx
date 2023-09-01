export default function Title() {
  return (
    <div className="flex justify-center py-3 items-center">
      <h1 className="text-4xl">
        <a className="text-white hover:text-gray-400" href="/">
          Tact
        </a>
      </h1>
      <div className="text-xs ml-4 text-slate-400">
        A game of trust in a trustless environment
      </div>
    </div>
  );
}
