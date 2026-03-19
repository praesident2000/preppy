export type ShoppingList = {
	[key: string]: string[];
};

export type House = {
	category?: string;
	subcategory?: string[];
};

export type Diet = "omnivore" | "vegetarian" | "vegan";
