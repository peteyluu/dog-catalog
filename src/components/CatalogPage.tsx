import { Flex, Heading, Item, ListView, TagGroup, Text, Key, Image, Slider, Button } from "@adobe/react-spectrum";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Heart from "react-heart";
import DogDetailsPage from "./DogDetailsPage";
import "./styles.css";
import { BreedItem, DogDetails } from "../models";

const CatalogPage = () => {
  const [count, setCount] = useState<number>(0);
  const [maxBreed, setMaxBreed] = useState<number>(4);
  const [dogBreeds, setDogBreeds] = useState<BreedItem[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<any>(new Set());
  const [tagGroup, setTagGroup] = useState<BreedItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoritesMode, setFavoritesMode] = useState<Boolean>(false);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteBreeds");
    if (storedFavorites) {
      const data = JSON.parse(storedFavorites);
      setFavorites(data);
      setCount(data.length);
    }
  }, []);

  useEffect(() => {
    const fetchDogBreeds = async () => {
      try {
        const response = await fetch("https://api.thedogapi.com/v1/breeds?image=true", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        const items = data.map((el: DogDetails): BreedItem => {
          return { id: el.id, name: el.name, reference_image_id: el.reference_image_id };
        });
        setDogBreeds(items);
      } catch (error) {
        console.error("Error fetching dog breeds:", error);
      }
    };

    fetchDogBreeds();
  }, [dogBreeds]);

  useEffect(() => {
    const idSet = new Set([...selectedKeys.entries()].map((el: any) => parseInt(el[0])));
    const selectedBreeds = dogBreeds.filter((dogBreed) => idSet.has(dogBreed.id));
    setTagGroup(selectedBreeds);
  }, [selectedKeys]);

  const onRemove = (keys: Set<Key>) => {
    setTagGroup((prevItems: BreedItem[]) => prevItems.filter((item: BreedItem) => !keys.has(item.id)));
    setSelectedKeys((set: any) => {
      const newKeys: any = [...set].filter((item: any) => !keys.has(parseInt(item)));
      return new Set(newKeys);
    });
  };
  const isValid = tagGroup.length <= maxBreed;
  const toggleFavorite = (breed) => {
    const isFavorite = favorites.includes(breed);
    const updatedFavorites = isFavorite
      ? favorites.filter((favoriteBreed) => favoriteBreed !== breed)
      : [...favorites, breed];

    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteBreeds", JSON.stringify(updatedFavorites));
  };
  return (
    <Flex direction="column" UNSAFE_className="main_container">
      <Flex direction="row" justifyContent="space-between" alignItems="center" marginX="size-300">
        <Heading height="size-400" level={1}>
          {"Dog Catalog"}
        </Heading>
        <Button variant="primary" marginTop="size-100" onPress={() => setFavoritesMode(!favoritesMode)}>
          {!favoritesMode ? (
            <>
              <div style={{ width: "1rem", padding: "4px 4px 0px 0px" }}>
                <Heart isActive={true} onClick={() => {}} />
              </div>
              <Text>{count} Dogs</Text>
            </>
          ) : (
            <Link to="/">Go Home</Link>
          )}
        </Button>
      </Flex>

      {!favoritesMode ? (
        <Flex gap="size-100" UNSAFE_className="container">
          <Flex direction="column" gap="size-100">
            <ListView
              margin="size-300"
              width="size-5000"
              height="size-6000"
              aria-label="ListView with controlled selection"
              selectionMode="multiple"
              items={dogBreeds}
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
            >
              {(item) => (
                <Item key={item.id.toString()} textValue={item.name}>
                  <Image
                    src={`https://cdn2.thedogapi.com/images/${item?.reference_image_id}.jpg`}
                    alt={item?.name || ""}
                  />
                  <Text>{item.name}</Text>
                </Item>
              )}
            </ListView>
            <Slider
              margin="size-300"
              label="Breeds to compare"
              value={maxBreed}
              onChange={setMaxBreed}
              minValue={2}
              maxValue={dogBreeds.length}
              defaultValue={4}
            />
          </Flex>
          <Flex direction="column" gap="size-100" height="size-6000" UNSAFE_className="tag-group">
            <TagGroup
              marginTop="size-300"
              maxRows={2}
              width="size-6000"
              label="Breeds Selected"
              items={tagGroup}
              onRemove={onRemove}
              actionLabel="Clear"
              onAction={() => setSelectedKeys(new Set())}
              aria-label="TagGroup help text example"
              isInvalid={!isValid}
              errorMessage={`Must contain no more than ${maxBreed} breeds. Please remove some or configure the slider.`}
            >
              {(item: BreedItem) => <Item>{item.name}</Item>}
            </TagGroup>
            <Flex direction="row" gap="size-100" height="size-6000" wrap>
              {tagGroup.slice(0, maxBreed).map((el: BreedItem) => (
                <DogDetailsPage
                  key={el.id}
                  id={el.id}
                  setCount={setCount}
                  toggleFavorite={toggleFavorite}
                  favorites={favorites}
                />
              ))}
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <Flex direction="row" gap="size-100" height="size-6000" margin="size-300" wrap>
          {favorites.map((id) => (
            <DogDetailsPage
              key={id}
              id={id}
              setCount={setCount}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default CatalogPage;
