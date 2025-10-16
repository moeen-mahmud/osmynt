import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Problem } from "@/components/problem";
import { Features } from "@/components/features";
import { Security } from "@/components/security";
import { Comparison } from "@/components/comparison";
import { FAQ } from "@/components/faq";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";

export default function Home() {
	return (
		<main className="min-h-screen">
			<Header />
			<Hero />
			<Problem />
			<Features />
			<Security />
			<Comparison />
			<FAQ />
			<CTA />
			<Footer />
		</main>
	);
}
