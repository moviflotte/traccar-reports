import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	proxy: {
		'/api/socket': 'ws://gps.rastreosat.com.br',
		'/api': 'http://gps.rastreosat.com.br',
	},
});
