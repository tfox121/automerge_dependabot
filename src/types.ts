import { RestEndpointMethodTypes } from '@octokit/rest';

export interface PrStatus {
	state: string;
	context: string;
	description: string | null;
	target_url: string | null;
}

export type CheckRuns =
	RestEndpointMethodTypes['checks']['listForRef']['response']['data']['check_runs'];

export interface User {
	accountId: string;
	accountType: string;
	active: boolean;
	applicationRoles: {
		items: any[];
		size: number;
	};
	avatarUrls: {
		'16x16': string;
		'24x24': string;
		'32x32': string;
		'48x48': string;
	};
	displayName: string;
	emailAddress: string;
	groups: {
		items: any[];
		size: number;
	};
	key: string;
	name: string;
	self: string;
	timeZone: string;
}
export interface Issue {
	id?: string;
	key?: string;
	self?: string;
	expand?: string;
	fields: Fields;
}

interface Fields {
	resolution?: Resolution;
	customfield_10500?: CustomField10500;
	customfield_11039?: number;
	lastViewed?: string;
	customfield_11034?: number;
	customfield_11035?: number;
	customfield_11036?: number;
	customfield_11037?: number;
	customfield_11114?: DevelopmentPod;
	labels?: string[];
	customfield_11038?: number;
	aggregatetimeoriginalestimate?: null;
	issuelinks?: IssueLink[];
	assignee?: Assignee;
	components?: any[];
	summary: string;
	description?: Description;
	priority?: Priority;
	status?: Status;
	reporter: Assignee;
	project: {
		id?: string;
		key?: string;
	};
	issuetype: {
		id?: string;
		name?: string;
	};
}

interface Resolution {
	self: string;
	id: string;
	description: string;
	name: string;
}

interface CustomField10500 {
	hasEpicLinkFieldDependency: boolean;
	showField: boolean;
	nonEditableReason: {
		reason: string;
		message: string;
	};
}

interface DevelopmentPod {
	self: string;
	value: string;
	id: string;
}

interface IssueLink {
	id: string;
	self: string;
	type: IssueLinkType;
	outwardIssue?: IssueLite;
	inwardIssue?: IssueLite;
}

interface Assignee {
	id: string;
}

interface IssueLinkType {
	id: string;
	name: string;
	inward: string;
	outward: string;
	self: string;
}

interface IssueLite {
	id: string;
	key: string;
	self: string;
	fields: {
		summary: string;
		status: Status;
		priority: Priority;
		issuetype: IssueType;
	};
}

interface Status {
	self: string;
	description: string;
	iconUrl: string;
	name: string;
	id: string;
	statusCategory: StatusCategory;
}

interface Priority {
	self: string;
	iconUrl: string;
	name: string;
	id: string;
}

interface IssueType {
	self: string;
	id: string;
	description: string;
	iconUrl: string;
	name: string;
	subtask: boolean;
	avatarId: number;
	hierarchyLevel: number;
}

interface Description {
	version: number;
	type: string;
	content: Content[];
}

export interface Content {
	type: string;
	content: TextContent[];
}

interface TextContent {
	type: string;
	text: string;
}

interface StatusCategory {
	self: string;
	id: number;
	key: string;
	colorName: string;
	name: string;
}
