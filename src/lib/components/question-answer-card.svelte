<script lang="ts">
	import { cn } from '$lib';
	import type { Question } from '$lib/types';
	import { Check, X } from '@lucide/svelte';

	interface Props {
		questionIndex: number;
		question: Question;
		userAnswers: number[];
		correctAnswers: number[];
	}

	let { questionIndex, question, userAnswers, correctAnswers }: Props = $props();

	const isCorrect = $derived.by(() => {
		if (question.type === 'single') {
			return userAnswers.length === 1 && userAnswers[0] === correctAnswers[0];
		}

		if (userAnswers.length !== correctAnswers.length) {
			return false;
		}

		const sortedUserAnswers = [...userAnswers].sort((a, b) => a - b);
		const sortedCorrectAnswers = [...correctAnswers].sort((a, b) => a - b);

		return sortedUserAnswers.every((answer, index) => answer === sortedCorrectAnswers[index]);
	});
</script>

<div
	class={cn('rounded-xl border-2 p-4 transition-all duration-200 sm:p-6', {
		'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg shadow-green-100/50':
			isCorrect,
		'border-red-300 bg-gradient-to-r from-red-50 to-rose-50 shadow-lg shadow-red-100/50': !isCorrect
	})}
>
	<div class="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:gap-4">
		<div
			class={cn(
				'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-bold text-white sm:h-10 sm:w-10',
				{
					'bg-gradient-to-r from-green-500 to-emerald-600': isCorrect,
					'bg-gradient-to-r from-red-500 to-rose-600': !isCorrect
				}
			)}
		>
			{#if isCorrect}
				<Check class="size-4 sm:size-5" />
			{:else}
				<X class="size-4 sm:size-5" />
			{/if}
		</div>
		<div class="min-w-0 flex-1">
			<div class="mb-2 flex items-center gap-2">
				<span class="text-sm font-bold text-gray-500">Q{questionIndex + 1}</span>
				<div
					class={cn('rounded-full px-2 py-1 text-xs font-medium', {
						'bg-green-100 text-green-700': isCorrect,
						'bg-red-100 text-red-700': !isCorrect
					})}
				>
					{isCorrect ? 'Correct' : 'Incorrect'}
				</div>
			</div>
			<h3 class="text-base leading-relaxed font-semibold text-gray-800 sm:text-lg">
				{question.question}
			</h3>
		</div>
	</div>

	<div class="grid gap-2 sm:gap-3">
		{#each question.options as option, optionIndex}
			{@const isUserSelected = userAnswers.includes(optionIndex)}
			{@const isCorrectOption = correctAnswers.includes(optionIndex)}
			<div
				class={cn(
					'flex items-start gap-3 rounded-lg p-3 transition-all duration-200 sm:items-center sm:gap-4 sm:p-4',
					{
						'border border-green-200 bg-green-100': isCorrectOption,
						'border border-red-200 bg-red-100': isUserSelected && !isCorrectOption,
						'border border-gray-100 bg-gray-50': !isUserSelected && !isCorrectOption
					}
				)}
			>
				<div class="flex h-6 w-6 flex-shrink-0 items-center justify-center sm:h-7 sm:w-7">
					{#if isCorrectOption}
						<div
							class="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 sm:h-6 sm:w-6"
						>
							<Check class="size-3 text-white sm:size-4" />
						</div>
					{:else if isUserSelected}
						<div
							class="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 sm:h-6 sm:w-6"
						>
							<X class="size-3 text-white sm:size-4" />
						</div>
					{:else}
						<div class="h-5 w-5 rounded-full border-2 border-gray-300 sm:h-6 sm:w-6"></div>
					{/if}
				</div>

				<span
					class={cn('flex-1 text-sm leading-relaxed font-medium sm:text-base', {
						'text-green-800': isCorrectOption,
						'text-red-800': isUserSelected && !isCorrectOption,
						'text-gray-600': !isUserSelected && !isCorrectOption
					})}
				>
					{option}
				</span>

				<div class="flex flex-shrink-0 flex-col gap-1 sm:flex-row sm:gap-2">
					{#if isUserSelected && !isCorrectOption}
						<span
							class="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700"
						>
							<X class="size-5" />
							Votre choix
						</span>
					{:else if isCorrectOption}
						<span
							class="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
						>
							<Check class="size-5" />
							Bonne réponse
						</span>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
