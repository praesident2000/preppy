export type House = {
	category?: string;
	subcategory?: string[];
};

export type ShoppingList = {
	[key: string]: string[];
};

export type FoodProps = {
	people: string[];
	days: number;
	shoppingList: ShoppingList;
	setShoppingList: React.Dispatch<React.SetStateAction<ShoppingList>>;
};

export type PeopleProps = {
	people: string[];
	setPeople: React.Dispatch<React.SetStateAction<string[]>>;
};

export type Step01Props = {
	currentStep: number;
	theme: string;
	setTheme: React.Dispatch<React.SetStateAction<string>>;
};

export type Step02Props = {
	currentStep: number;
	house: House;
	setHouse: React.Dispatch<React.SetStateAction<House>>;
};

export type Step03Props = {
	currentStep: number;
	days: number;
	setDays: React.Dispatch<React.SetStateAction<number>>;
	people: string[];
	setPeople: React.Dispatch<React.SetStateAction<string[]>>;
	shoppingList: ShoppingList;
	setShoppingList: React.Dispatch<React.SetStateAction<ShoppingList>>;
};

export type Step04Props = {
	currentStep: number;
	equipment: string[];
	setEquipment: React.Dispatch<React.SetStateAction<string[]>>;
};

export type Step05Props = {
	currentStep: number;
	house: House;
	equipment: string[];
	shoppingList: ShoppingList;
};
