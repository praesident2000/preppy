import type { House, ShoppingList } from "./types/types";

export type State = {
	step: number;
	theme: string;
	house: House;
	days: number;
	people: string[];
	shoppingList: ShoppingList;
	equipment: string[];
};

export type Action =
	| { type: "set_step"; payload: number }
	| { type: "step_decrement" }
	| { type: "step_increment" }
	| { type: "set_theme"; payload: string }
	| { type: "set_house"; payload: House }
	| { type: "set_days"; payload: number }
	| { type: "set_people"; payload: string[] }
	| { type: "toggle_shoppinglist"; payload: { category: keyof ShoppingList; element: string } }
	| { type: "set_shoppinglist"; payload: ShoppingList }
	| { type: "toggle_equipment"; payload: string }
	| { type: "set_equipment"; payload: string[] };

export const initialState: State = {
	step: 1,
	theme: "",
	house: {
		category: "",
		subcategory: [],
	},
	days: 10,
	people: ["omnivore"],
	shoppingList: {
		drinks: [],
		grains: [],
		veggies: [],
		fruit: [],
		dairy: [],
		meat: [],
		fats: [],
	},
	equipment: [],
};

export function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "set_step":
			return { ...state, step: action.payload };
		case "step_decrement":
			return {
				...state,
				step: state.step - 1,
			};
		case "step_increment":
			return {
				...state,
				step: state.step + 1,
			};
		case "set_theme":
			return {
				...state,
				theme: action.payload,
			};
		case "set_house":
			return {
				...state,
				house: action.payload,
			};
		case "set_days":
			return {
				...state,
				days: action.payload,
			};
		case "set_people":
			return {
				...state,
				people: action.payload,
			};
		case "toggle_shoppinglist": {
			const { category, element } = action.payload;
			const current = state.shoppingList[category] ?? [];
			const exists = current.includes(element);
			return {
				...state,
				shoppingList: {
					...state.shoppingList,
					[category]: exists
						? current.filter((item) => item !== element)
						: [...current, element],
				},
			};
		}
		case "set_shoppinglist":
  			return { 
				...state, 
				shoppingList: action.payload 
			};
		case "toggle_equipment": {
			const exists = state.equipment.includes(action.payload);
			return {
				...state,
				equipment: exists
					? state.equipment.filter((item) => item !== action.payload)
					: [...state.equipment, action.payload],
			};
		}
		case "set_equipment":
  			return { 
				...state, 
				equipment: action.payload 
			};
		default:
			return state;
	}
}
