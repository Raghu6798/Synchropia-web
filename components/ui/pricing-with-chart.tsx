'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';

export function PricingWithChart() {
	return (
		<div className="mx-auto max-w-6xl w-full">
			{/* Heading */}
			<div className="mx-auto mb-10 max-w-2xl text-center">
				<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-650 dark:from-white dark:via-zinc-200 dark:to-zinc-500">
					Pricing that Scales with You
				</h1>
				<p className="text-muted-foreground mt-4 text-sm md:text-base">
					Choose the right plan to unlock powerful tools and insights.
					Transparent pricing built for modern teams.
				</p>
			</div>

			{/* Pricing Grid */}
			<div className="bg-white/60 dark:bg-zinc-950/45 backdrop-blur-md grid rounded-3xl border border-zinc-200 dark:border-zinc-900/80 md:grid-cols-6 overflow-hidden shadow-xl">
				{/* Free Plan */}
				<div className="flex flex-col justify-between border-b border-zinc-200 dark:border-zinc-900/85 p-8 md:col-span-2 md:border-r md:border-b-0">
					<div className="space-y-4">
						<div>
							<h2 className="backdrop-blur-2 inline rounded-[2px] p-1 text-xl font-bold text-zinc-900 dark:text-zinc-100">
								Free Node
							</h2>
							<span className="my-3 block text-3xl font-black text-zinc-950 dark:text-[#8AFF00]">
								$0
							</span>
							<p className="text-muted-foreground text-sm leading-relaxed">
								Best for sandbox testing & local orchestrations.
							</p>
						</div>

						<Button asChild variant="outline" className="w-full rounded-xl">
							<a href="/login">Get Started</a>
						</Button>

						<div className="bg-zinc-200 dark:bg-zinc-900 my-6 h-px w-full" />

						<ul className="text-zinc-600 dark:text-zinc-400 space-y-3 text-sm">
							{[
								'Basic Analytics Dashboard',
								'5GB Cloud Sandbox Storage',
								'Email & Community Support',
							].map((item, index) => (
								<li key={index} className="flex items-center gap-2">
									<CheckCircle2 className="h-4 w-4 text-[#8AFF00] shrink-0" />
									{item}
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Pro Plan */}
				<div className="z-10 grid gap-8 overflow-hidden p-8 md:col-span-4 lg:grid-cols-2">
					{/* Pricing + Chart */}
					<div className="flex flex-col justify-between space-y-6">
						<div>
							<h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Pro Enterprise Factory</h2>
							<span className="my-3 block text-3xl font-black text-zinc-950 dark:text-[#8AFF00]">
								$299<span className="text-xs text-muted-foreground font-normal">/mo</span>
							</span>
							<p className="text-muted-foreground text-sm leading-relaxed">
								Perfect for growing software teams requiring isolated VPC nodes.
							</p>
						</div>
						<div className="bg-zinc-100/50 dark:bg-zinc-950/60 h-fit w-full rounded-2xl border border-zinc-200 dark:border-zinc-900 p-2 shadow-inner">
							<InterestChart />
						</div>
					</div>
					{/* Features */}
					<div className="relative w-full flex flex-col justify-between">
						<div>
							<div className="text-sm font-bold text-zinc-950 dark:text-zinc-100">Everything in Free plus:</div>
							<ul className="text-zinc-600 dark:text-zinc-400 mt-4 space-y-3 text-sm">
								{[
									'Unlimited access to all agent swarms',
									'Priority 24/7 dedicated engineering support',
									'Stateful memory sync & dashboard nodes',
									'VPC private subnet isolation triggers',
									'Automated type & lint checks',
									'Secure state storage',
									'Direct VCS & DevOps integrations',
									'Role-based permissions & admin gates',
									'Offline caching & automatic sync',
									'Frequent upgrades with custom plugins',
								].map((item, index) => (
									<li key={index} className="flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4 text-[#8AFF00] shrink-0" />
										{item}
									</li>
								))}
							</ul>
						</div>

						{/* Call to Action */}
						<div className="mt-10 grid grid-cols-2 gap-2.5 w-full">
							<Button
								asChild
								className="bg-[#8AFF00] hover:bg-[#8AFF00]/95 text-black hover:text-black font-bold rounded-xl border border-[#8AFF00] shadow-[0_0_15px_rgba(138,255,0,0.2)] transition-all duration-300"
							>
								<a href="/login">Get Started</a>
							</Button>
							<Button asChild variant="outline" className="rounded-xl">
								<a href="/login?signup=true">Start free trial</a>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function InterestChart() {
	const chartData = [
		{ month: 'January', interest: 120 },
		{ month: 'February', interest: 180 },
		{ month: 'March', interest: 150 },
		{ month: 'April', interest: 210 },
		{ month: 'May', interest: 250 },
		{ month: 'June', interest: 300 },
		{ month: 'July', interest: 280 },
		{ month: 'August', interest: 320 },
		{ month: 'September', interest: 340 },
		{ month: 'October', interest: 390 },
		{ month: 'November', interest: 420 },
		{ month: 'December', interest: 500 },
	];

	const chartConfig = {
		interest: {
			label: 'Subscribers',
			color: '#8AFF00',
		},
	} satisfies ChartConfig;

	return (
		<Card className="border-none bg-transparent shadow-none">
			<CardHeader className="space-y-0 border-b border-zinc-200/50 dark:border-zinc-900/60 p-3">
				<CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Plan Popularity Trend</CardTitle>
				<CardDescription className="text-[10px] text-zinc-500 dark:text-zinc-400">
					Monthly trend of organizations adopting this configuration.
				</CardDescription>
			</CardHeader>
			<CardContent className="p-3 pb-0">
				<ChartContainer config={chartConfig} className="h-28 w-full">
					<LineChart data={chartData} margin={{ left: 6, right: 6, top: 4, bottom: 4 }}>
						<CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800/80" />
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tickMargin={4}
							tickFormatter={(value) => value.slice(0, 3)}
							className="text-[9px] fill-zinc-500"
						/>
						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
						<Line
							dataKey="interest"
							type="monotone"
							stroke="var(--color-interest)"
							strokeWidth={2}
							dot={false}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
