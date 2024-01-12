export type DogDetails = {
  bred_for: string;
  breed_group: string;
  height: { imperial: string; metric: string };
  id: number;
  life_span: string;
  name: string;
  origin: string;
  reference_image_id: string;
  temperament: string;
  weight: { imperial: string; metric: string };
};

export type BreedItem = {
  id: number;
  name: string;
  reference_image_id: string;
};

export type DogDetailsProp = {
  id: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  toggleFavorite: (breed: any) => void;
  favorites: number[];
};
