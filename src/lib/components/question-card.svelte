<script lang="ts">
	import { Check, Info } from '@lucide/svelte';
	
	import { cn } from '$lib';
	import type { Question } from '$lib/types';

	interface Props {
		currentQuestion: Question;
		handleAnswer: (index: number) => void;
		isOptionSelected: (index: number) => boolean;
	}

	let { currentQuestion, handleAnswer, isOptionSelected }: Props = $props();
</script>

<div class="space-y-6 lg:space-y-8">
	<div class="text-center sm:text-left">
		<h2 class="text-xl leading-relaxed font-semibold text-gray-800 sm:text-2xl lg:text-3xl">
			{currentQuestion.question}
		</h2>
	</div>

	{#if currentQuestion.type === 'multiple'}
		<div
			class="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 sm:justify-start sm:p-4"
		>
			<div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
				<Info class="size-4 text-white" />
			</div>
			<p class="text-sm font-medium text-blue-700 sm:text-base">
				💡 Sélectionnez toutes les bonnes réponses
			</p>
		</div>
	{/if}

	<div class="grid gap-3 sm:gap-4">
		{#each currentQuestion.options as option, index}
			<button
				onclick={() => handleAnswer(index)}
				class={cn(
					'group w-full transform rounded-xl border-2 p-4 text-left transition-all duration-200 hover:scale-[1.01] focus:ring-4 focus:outline-none sm:p-5',
					{
						'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900 shadow-md ring-blue-200':
							isOptionSelected(index),
						'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 hover:shadow-md focus:ring-gray-200':
							!isOptionSelected(index)
					}
				)}
			>
				<div class="flex items-start gap-3 sm:items-center sm:gap-4">
					<div
						class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center sm:mt-0 sm:h-7 sm:w-7"
					>
						{#if currentQuestion.type === 'single'}
							<div
								class={cn(
									'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-200 sm:h-6 sm:w-6',
									{
										'border-blue-500 bg-blue-500 shadow-sm': isOptionSelected(index),
										'border-gray-400 group-hover:border-gray-500': !isOptionSelected(index)
									}
								)}
							>
								{#if isOptionSelected(index)}
									<div class="h-2 w-2 rounded-full bg-white sm:h-2.5 sm:w-2.5"></div>
								{/if}
							</div>
						{:else}
							<div
								class={cn(
									'flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all duration-200 sm:h-6 sm:w-6',
									{
										'border-blue-500 bg-blue-500 shadow-sm': isOptionSelected(index),
										'border-gray-400 group-hover:border-gray-500': !isOptionSelected(index)
									}
								)}
							>
								{#if isOptionSelected(index)}
									<Check class="size-3 text-white sm:size-4" />
								{/if}
							</div>
						{/if}
					</div>
					<span
						class="flex-1 text-sm leading-relaxed font-medium text-gray-800 sm:text-base lg:text-lg"
					>
						{option}
					</span>
					{#if isOptionSelected(index)}
						<div
							class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 sm:h-7 sm:w-7"
						>
							<Check class="size-3 text-white sm:size-4" />
						</div>
					{/if}
				</div>
			</button>
		{/each}
	</div>
</div>
