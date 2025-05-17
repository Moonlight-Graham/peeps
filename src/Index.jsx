// src/pages/index.jsx

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-yellow-50 text-gray-900">
      <Head>
        <title>Peeps | The Cutest Chick in Crypto</title>
        <meta name="description" content="$PEEPS is a meme coin on Solana powered by the community." />
        <link rel="icon" href="/chick-icon.png" />
      </Head>

      <main className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <Image src="/chick-icon.png" alt="$PEEPS Chick" width={100} height={100} />

        <h1 className="text-4xl font-bold mt-6">$PEEPS</h1>
        <p className="mt-2 text-lg">The Cutest Chick in Crypto 🐣</p>

        <p className="mt-4 text-sm text-gray-700">
          Token Address:<br />
          <span className="break-all text-blue-600">8DFkuXQWU85VtpVzfw914YTU2ePNchdk9au58gMJb3W2</span>
        </p>

        <div className="mt-8">
          <Link href="#" className="bg-yellow-400 text-black font-semibold py-2 px-6 rounded-full shadow hover:bg-yellow-300">
            Claim Airdrop (Coming Soon)
          </Link>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          Powered by the Solana community. No utility. Just fluff.
        </div>
      </main>
    </div>
  );
}
