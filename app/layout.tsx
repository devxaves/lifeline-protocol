import type { Metadata } from 'next'
import { WalletProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from '@aptos-labs/wallet-adapter-petra';
import './globals.css'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <WalletProvider wallets={[new PetraWallet()]} autoConnect={true}>
         <body>{children}</body>
      </WalletProvider>
    </html>
  )
}
