declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"blog": {
"[staging]/advances-features-with-clickhouse-udfs.md": {
	id: "[staging]/advances-features-with-clickhouse-udfs.md";
  slug: "staging/advances-features-with-clickhouse-udfs";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"[staging]/clickhouse-data-types.md": {
	id: "[staging]/clickhouse-data-types.md";
  slug: "staging/clickhouse-data-types";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"[staging]/clickhouse-for-business-intelligence.md": {
	id: "[staging]/clickhouse-for-business-intelligence.md";
  slug: "staging/clickhouse-for-business-intelligence";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"[staging]/clickhouse-horizontal-vs-vertical-scaling.md": {
	id: "[staging]/clickhouse-horizontal-vs-vertical-scaling.md";
  slug: "staging/clickhouse-horizontal-vs-vertical-scaling";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"[staging]/clickhouse-realtime-analytics.md": {
	id: "[staging]/clickhouse-realtime-analytics.md";
  slug: "staging/clickhouse-realtime-analytics";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"[staging]/clickhouse-vs-bigquery.md": {
	id: "[staging]/clickhouse-vs-bigquery.md";
  slug: "staging/clickhouse-vs-bigquery";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"[staging]/clickhouse-vs-snowflake.md": {
	id: "[staging]/clickhouse-vs-snowflake.md";
  slug: "staging/clickhouse-vs-snowflake";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"[staging]/concurrency-tips-for-clickhouse.md": {
	id: "[staging]/concurrency-tips-for-clickhouse.md";
  slug: "staging/concurrency-tips-for-clickhouse";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"[staging]/getting-familiar-with-clickhouse-query-api.md": {
	id: "[staging]/getting-familiar-with-clickhouse-query-api.md";
  slug: "staging/getting-familiar-with-clickhouse-query-api";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"[staging]/ten-clickhouse-table-functions.md": {
	id: "[staging]/ten-clickhouse-table-functions.md";
  slug: "staging/ten-clickhouse-table-functions";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"[staging]/ten-key-considerations-for-clickhouse-bulk.md": {
	id: "[staging]/ten-key-considerations-for-clickhouse-bulk.md";
  slug: "staging/ten-key-considerations-for-clickhouse-bulk";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"[staging]/understanding-clickhouse-mergetree-architecture.md": {
	id: "[staging]/understanding-clickhouse-mergetree-architecture.md";
  slug: "staging/understanding-clickhouse-mergetree-architecture";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"[staging]/use-cases-for-clickhouse-json.md": {
	id: "[staging]/use-cases-for-clickhouse-json.md";
  slug: "staging/use-cases-for-clickhouse-json";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"[staging]/using-kafka-with-clickhouse.md": {
	id: "[staging]/using-kafka-with-clickhouse.md";
  slug: "staging/using-kafka-with-clickhouse";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"[staging]/what-is-an-olap-database.md": {
	id: "[staging]/what-is-an-olap-database.md";
  slug: "staging/what-is-an-olap-database";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"why-we-bet-on-clickhouse.md": {
	id: "why-we-bet-on-clickhouse.md";
  slug: "why-we-bet-on-clickhouse";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
};
"docs": {
"documentation/code-blocks.mdx": {
	id: "documentation/code-blocks.mdx";
  slug: "documentation/code-blocks";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".mdx"] };
"documentation/commerce/data-fulfillment.mdx": {
	id: "documentation/commerce/data-fulfillment.mdx";
  slug: "documentation/commerce/data-fulfillment";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".mdx"] };
"documentation/commerce/payment-links.mdx": {
	id: "documentation/commerce/payment-links.mdx";
  slug: "documentation/commerce/payment-links";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".mdx"] };
"documentation/commerce/portals.mdx": {
	id: "documentation/commerce/portals.mdx";
  slug: "documentation/commerce/portals";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".mdx"] };
"documentation/commerce/stripe-connect.mdx": {
	id: "documentation/commerce/stripe-connect.mdx";
  slug: "documentation/commerce/stripe-connect";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".mdx"] };
"documentation/concepts.mdx": {
	id: "documentation/concepts.mdx";
  slug: "documentation/concepts";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".mdx"] };
"documentation/index.mdx": {
	id: "documentation/index.mdx";
  slug: "documentation";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".mdx"] };
"documentation/style-guide.mdx": {
	id: "documentation/style-guide.mdx";
  slug: "documentation/style-guide";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".mdx"] };
"getting-started.mdx": {
	id: "getting-started.mdx";
  slug: "getting-started";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".mdx"] };
"in-progress.mdx": {
	id: "in-progress.mdx";
  slug: "in-progress";
  body: string;
  collection: "docs";
  data: any
} & { render(): Render[".mdx"] };
};
"guides": {
"build-blog-using-astro-mdx.mdx": {
	id: "build-blog-using-astro-mdx.mdx";
  slug: "build-blog-using-astro-mdx";
  body: string;
  collection: "guides";
  data: any
} & { render(): Render[".mdx"] };
"using-next-auth-next-13.mdx": {
	id: "using-next-auth-next-13.mdx";
  slug: "using-next-auth-next-13";
  body: string;
  collection: "guides";
  data: any
} & { render(): Render[".mdx"] };
};
"releases": {
"1_0.md": {
	id: "1_0.md";
  slug: "1_0";
  body: string;
  collection: "releases";
  data: any
} & { render(): Render[".md"] };
"1_4.md": {
	id: "1_4.md";
  slug: "1_4";
  body: string;
  collection: "releases";
  data: any
} & { render(): Render[".md"] };
"1_8.md": {
	id: "1_8.md";
  slug: "1_8";
  body: string;
  collection: "releases";
  data: any
} & { render(): Render[".md"] };
"2_0.md": {
	id: "2_0.md";
  slug: "2_0";
  body: string;
  collection: "releases";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = never;
}
