import { PrStatus } from '../types';

export function get_project_name(statuses: PrStatus[]): string | undefined {
	const aws_status = statuses.find((status) => status.target_url?.includes('aws.amazon'));
	const regex = /\((.*?)\)/;
	if (!aws_status) {
		console.error('No AWS status found');
		return;
	}
	const match = aws_status.context.match(regex);
	if (!match) {
		console.error(`Project name could not be determined from context: ${aws_status.context}`);
		return;
	}
	return match[1];
}
