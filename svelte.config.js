import adapter from '@sveltejs/adapter-netlify';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			edge: false,
			split: false,
			platform: 'node'
		}),
		prerender: {
			handleMissingId: 'ignore'
		},
		alias: {
			$lib: 'src/lib'
		}
	},
	preprocess: preprocess()
};

export default config;
