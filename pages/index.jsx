pages/index.jsx

import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 via-pink-100 to-purple-100 text-gray-900 font-sans">
      <Head>
        <title>Peeps | The Cutest Chick in Crypto</title>
        <meta name="description" content="$PEEPS is a meme coin on Solana powered by the community." />
        <link rel="icon" href="/chick-icon.png" />
      </Head>

      <main className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <Image src="/chick-icon.png" alt="$PEEPS Chick" width={120} height={120} className="rounded-full border-4 border-yellow-400 shadow-md" />

        <h1 className="text-6xl font-extrabold mt-6 text-yellow-600 drop-shadow">$PEEPS</h1>
        <p className="mt-2 text-xl italic text-gray-700">The Cutest Chick in Crypto 🐣</p>

        <p className="mt-6 text-sm text-gray-800">
          Token Address:<br />
          <span className="break-all font-mono text-blue-600">8DFkuXQWU85VtpVzfw914YTU2ePNchdk9au58gMJb3W2</span>
        </p>

        <div className="mt-10">
          <button className="bg-yellow-400 text-black text-lg font-bold py-3 px-8 rounded-full shadow-xl hover:bg-yellow-300 transition-all">
            Join the Coop 🐥🚀
          </button>
        </div>

        <div className="mt-12 max-w-lg text-sm text-gray-600 italic">
          Born on Solana. No utility. No roadmap. No promises. Just fluff, fun, and feathers.
        </div>
      </main>
    </div>
  );
}
