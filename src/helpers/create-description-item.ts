import { Content } from '../types';

export function create_description_item(text: string): Content {
	return {
		content: [
			{
				text,
				type: 'text',
			},
		],
		type: 'paragraph',
	};
}
