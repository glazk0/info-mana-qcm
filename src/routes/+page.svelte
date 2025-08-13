<script lang="ts">
	import type { PageProps } from './$types';

	import { SvelteMap } from 'svelte/reactivity';

	import {
		BookOpen,
		ChevronLeft,
		ChevronRight,
		CircleCheckBig,
		File,
		Play,
		RotateCcw,
		Settings
	} from '@lucide/svelte';

	import QuestionAnswerCard from '$lib/components/question-answer-card.svelte';
	import QuestionCard from '$lib/components/question-card.svelte';

	import { settings } from '$lib/states/settings.svelte';
	import type { Question } from '$lib/types';

	let { data }: PageProps = $props();

	let { questions } = $derived(data);

	let started = $state(false);
	let result = $state(false);
	let pool = $state<Question[]>([]);
	let answers = new SvelteMap<number, number[]>([]);
	let currentQuestionIndex = $state(0);

	const currentQuestion = $derived(pool[currentQuestionIndex]);
	const progress = $derived(Math.round(((currentQuestionIndex + 1) / pool.length) * 100));
	const isLastQuestion = $derived(currentQuestionIndex === pool.length - 1);

	const score = $derived.by(() => {
		let correct = 0;
		let total = pool.length;

		for (let question in pool) {
			const userAnswers = answers.get(pool[question].id) || [];
			const correctAnswers = pool[question].correct;

			switch (pool[question].type) {
				case 'single':
					if (userAnswers.length === 1 && userAnswers[0] === correctAnswers[0]) {
						correct++;
					}
					break;
				case 'multiple':
					if (
						userAnswers.length === correctAnswers.length &&
						userAnswers.every((val, index) => val === correctAnswers[index])
					) {
						correct++;
					}
					break;
			}
		}

		return {
			correct,
			total,
			percentage: Math.round((correct / total) * 100)
		};
	});

	const startQuiz = () => {
		started = true;
		pool = questions
			.sort(() => 0.5 - Math.random())
			.slice(0, settings.current.questions) as Question[];
		answers.clear();
		currentQuestionIndex = 0;
		result = false;
	};

	const restartQuiz = () => {
		started = false;
		pool = [];
		answers.clear();
		currentQuestionIndex = 0;
		result = false;
	};

	const nextQuestion = () => {
		if (isLastQuestion) {
			result = true;
		} else {
			currentQuestionIndex += 1;
		}
	};

	const previousQuestion = () => {
		if (currentQuestionIndex > 0) {
			currentQuestionIndex -= 1;
		}
	};

	const handleAnswer = (index: number) => {
		const userAnswers = answers.get(currentQuestion.id) || [];
		if (currentQuestion.type === 'single') {
			answers.set(currentQuestion.id, [index]);
		} else {
			if (userAnswers.includes(index)) {
				answers.set(
					currentQuestion.id,
					userAnswers.filter((i) => i !== index)
				);
			} else {
				answers.set(currentQuestion.id, [...userAnswers, index]);
			}
		}
	};

	const isOptionSelected = (index: number) => {
		const questionId = currentQuestion.id;
		const userAnswers = answers.get(questionId) || [];
		return userAnswers.includes(index);
	};

	const canProceed = () => {
		const questionId = currentQuestion.id;
		const userAnswers = answers.get(questionId) || [];
		return userAnswers.length > 0;
	};
</script>

<div class="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
	<div class="animate-fade-in flex w-full max-w-4xl flex-col gap-4">
		{#if !started}
			<div class="flex flex-col gap-6 lg:gap-8">
				<div
					class="rounded-2xl border border-white/20 bg-white/80 p-6 text-center shadow-xl backdrop-blur-sm sm:p-8 lg:p-10"
				>
					<div class="flex flex-col items-center gap-4 sm:gap-6">
						<div
							class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg sm:h-20 sm:w-20"
						>
							<File class="size-8 text-white sm:size-10" />
						</div>
						<div>
							<h1
								class="mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl lg:text-4xl"
							>
								Questionnaire Info Mana
							</h1>
							<p class="max-w-2xl text-sm text-gray-600 sm:text-base lg:text-lg">
								Testez vos connaissances avec un total de <span class="font-semibold text-blue-600"
									>{questions.length} questions</span
								>. Certaines questions ont des réponses uniques, d'autres permettent des sélections
								multiples.
							</p>
						</div>
						<button
							onclick={startQuiz}
							class="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl focus:ring-4 focus:ring-blue-200 focus:outline-none sm:px-8 sm:py-4"
						>
							<span>Commencer le Quiz</span>
							<Play class="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
						</button>
					</div>
				</div>

				<div
					class="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm sm:p-8"
				>
					<div class="flex flex-col gap-4 sm:flex-row sm:items-center">
						<div class="flex flex-1 items-center gap-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-md"
							>
								<Settings class="size-5 text-white" />
							</div>
							<div>
								<h2 class="text-lg font-semibold text-gray-800 sm:text-xl">Paramètres du Quiz</h2>
								<p class="text-sm text-gray-600">Personnalisez votre expérience</p>
							</div>
						</div>
						<div class="flex items-center gap-3">
							<label for="poolSize" class="font-medium whitespace-nowrap text-gray-700"
								>Nombre de questions :</label
							>
							<input
								id="poolSize"
								type="number"
								bind:value={settings.current.questions}
								min="1"
								max={questions.length}
								class="w-20 rounded-xl border-2 border-gray-200 bg-white px-3 py-2 text-center font-medium shadow-sm transition-colors focus:border-blue-500 focus:outline-none sm:w-24"
							/>
						</div>
					</div>
				</div>
			</div>
		{:else if result}
			<div
				class="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm sm:p-8 lg:p-10"
			>
				<div class="mb-8 text-center lg:mb-10">
					<div class="flex flex-col items-center gap-4 sm:gap-6">
						<div
							class="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg sm:h-24 sm:w-24"
						>
							<CircleCheckBig class="size-10 text-white sm:size-12" />
						</div>
						<div>
							<h1
								class="mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl lg:text-4xl"
							>
								Quiz Terminé !
							</h1>
							<div class="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
								<div
									class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl lg:text-6xl"
								>
									{score.percentage}%
								</div>
								<div class="text-center text-base text-gray-600 sm:text-left sm:text-lg lg:text-xl">
									<div>Vous avez obtenu</div>
									<div class="font-semibold text-gray-800">
										{score.correct} sur {score.total} questions correctes
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="space-y-6 lg:space-y-8">
					<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<h2 class="flex items-center gap-2 text-xl font-semibold text-gray-800 sm:text-2xl">
							<BookOpen class="size-6 text-blue-600" />
							Révisez vos Réponses
						</h2>
						<div class="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
							<div class="h-2 w-2 rounded-full bg-blue-500"></div>
							<span class="text-sm font-medium text-gray-700">
								{pool.length} question{pool.length > 1 ? 's' : ''}
							</span>
						</div>
					</div>

					<div class="grid gap-4 sm:gap-6">
						{#each pool as question, questionIndex}
							<div
								class="rounded-xl border border-gray-200 bg-gray-50/50 p-4 transition-shadow hover:shadow-md sm:p-6"
							>
								<QuestionAnswerCard
									{questionIndex}
									{question}
									userAnswers={answers.get(question.id) || []}
									correctAnswers={question.correct}
								/>
							</div>
						{/each}
					</div>
				</div>

				<div class="mt-8 text-center lg:mt-10">
					<button
						onclick={restartQuiz}
						class="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl focus:ring-4 focus:ring-blue-200 focus:outline-none sm:px-8 sm:py-4"
					>
						<RotateCcw class="size-5 transition-transform duration-200 group-hover:-rotate-45" />
						<span>Reprendre le Quiz</span>
					</button>
				</div>
			</div>
		{:else}
			<div
				class="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm sm:p-8 lg:p-10"
			>
				<div class="mb-8 lg:mb-10">
					<div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
						<div class="flex items-center gap-2">
							<div
								class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600"
							>
								<span class="text-sm font-bold text-white">{currentQuestionIndex + 1}</span>
							</div>
							<span class="text-sm font-medium text-gray-600 sm:text-base">
								Question {currentQuestionIndex + 1} sur {pool.length}
							</span>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-sm font-medium text-gray-600">{Math.round(progress)}% Terminé</span>
							<div class="h-2 w-12 overflow-hidden rounded-full bg-gray-200">
								<div
									class="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
									style="width: {progress}%"
								></div>
							</div>
						</div>
					</div>
					<div class="h-2 w-full overflow-hidden rounded-full bg-gray-200">
						<div
							class="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
							style="width: {progress}%"
						></div>
					</div>
				</div>

				<div class="mb-8">
					<QuestionCard {currentQuestion} {handleAnswer} {isOptionSelected} />
				</div>

				<div class="flex flex-col gap-3 sm:flex-row sm:gap-4">
					<button
						onclick={previousQuestion}
						disabled={currentQuestionIndex === 0}
						class="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:shadow-none sm:px-6"
					>
						<ChevronLeft class="size-5" />
						<span class="hidden sm:inline">Précédent</span>
					</button>

					<div class="flex-1"></div>

					<button
						onclick={nextQuestion}
						disabled={!canProceed()}
						class="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl focus:ring-4 focus:ring-blue-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-lg sm:px-6"
					>
						<span>{isLastQuestion ? 'Terminer le Quiz' : 'Suivant'}</span>
						<ChevronRight
							class="size-5 transition-transform duration-200 group-hover:translate-x-1"
						/>
					</button>
				</div>
			</div>
		{/if}
		<div class="text-center text-sm text-gray-600">
			<div>
				Fait avec ❤️ par <a
					href="https://github.com/glazk0"
					class="text-blue-600 hover:underline"
					target="_blank"
					rel="noopener noreferrer">glazk0</a
				>
				• Inspiré par
				<a
					href="https://nizetarnaud.be"
					class="text-blue-600 hover:underline"
					target="_blank"
					rel="noopener noreferrer">Arnaud Nizet</a
				>
				•
				<a
					href="https://github.com/glazk0/info-mana-qcm"
					class="text-blue-600 hover:underline"
					target="_blank"
					rel="noopener noreferrer">Code source</a
				>
			</div>
		</div>
	</div>
</div>
