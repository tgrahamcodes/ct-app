import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import Navbar from '@/app/components/Navbar'

const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
	weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
	title: 'Medical Dashboard',
	description: 'Comprehensive medical management dashboard',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<div className="flex flex-col min-h-screen">
					<Navbar />

					<main className="flex-grow">
						{children}
					</main>

				</div>
			</body>
		</html>
	)
}