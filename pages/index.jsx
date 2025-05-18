import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 via-pink-100 to-purple-200 text-gray-900 font-sans px-4">
      <Head>
        <title>$PEEPS | The Cutest Chick in Crypto</title>
        <meta name="description" content="$PEEPS is a meme coin on Solana powered by the community." />
        <link rel="icon" href="/chick-icon.png" />
      </Head>

      <main className="flex flex-col items-center justify-center py-12 text-center max-w-xl mx-auto">
        <Image
          src="/chick-icon.png"
          alt="$PEEPS Chick Icon"
          width={120}
          height={120}
          className="rounded-full border-4 border-yellow-400 shadow-md mb-6 animate-bounce"
        />

        <h1 className="text-5xl font-extrabold text-yellow-600 drop-shadow-md">$PEEPS</h1>
        <p className="mt-2 text-lg text-gray-800 italic">The Cutest Chick in Crypto 🐣</p>

        <div className="mt-6 w-full bg-white bg-opacity-80 rounded-lg p-4 shadow-md text-left">
          <p className="text-sm text-gray-800 font-semibold">Token Address:</p>
          <p className="break-words font-mono text-blue-700 text-xs">
            8DFkuXQWU85VtpVzfw914YTU2ePNchdk9au58gMJb3W2
          </p>
        </div>

        <div className="mt-6">
          <button className="bg-yellow-400 text-black text-lg font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 hover:bg-yellow-300 transition-transform duration-200">
            Join the Coop 🐥🚀
          </button>
        </div>

        <p className="mt-6 max-w-md text-sm text-gray-700 italic">
          Born on Solana. No utility. No roadmap. No promises. Just fluff, fun, and feathers.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="https://x.com/peepssolana"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-all"
          >
            Twitter
          </a>
          <a
            href="https://t.me/peepssolana"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-all"
          >
            Telegram
          </a>
        </div>

        <div className="mt-10 text-xs text-gray-500">
          Wallet integration & live stats coming soon 🧠
        </div>
      </main>
    </div>
  );
}
