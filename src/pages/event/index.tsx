

import Image from 'next/image';

export default function Event() {
  return (
    <>
      <h1>
        イベント詳細
      </h1>
      <Image src="/qr.png" alt="イベント画像" width={150} height={150} style={{width: '100%', height: '100%'}} />
    </>
  );
}