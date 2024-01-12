import { useEffect, useState } from "react";
import { Heading, Image, View, Text, Flex, ProgressCircle } from "@adobe/react-spectrum";
import Heart from "react-heart";
import { DogDetails, DogDetailsProp } from "../models";
import "./styles.css";

const DogDetailsPage = (prop: DogDetailsProp) => {
  const { id, setCount, toggleFavorite, favorites } = prop;
  const [active, setActive] = useState<boolean>(favorites.includes(id));
  const [breedDetail, setBreedDetail] = useState<DogDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBreedDetail = async () => {
      try {
        const response = await fetch(`https://api.thedogapi.com/v1/breeds/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setLoading(false);
        setBreedDetail(data);
      } catch (error) {
        console.error("Error fetching dog breeds:", error);
      }
    };
    fetchBreedDetail();
  }, [id, breedDetail]);
  return (
    <>
      {loading ? (
        <ProgressCircle aria-label="Loading…" isIndeterminate />
      ) : (
        <View
          overflow="auto"
          maxWidth="size-3400"
          padding="size-100"
          borderWidth="thin"
          borderColor="gray-300"
          borderRadius="medium"
        >
          <Flex direction="column" gap="size-100">
            <Flex direction="row" gap="size-100" justifyContent="space-between">
              <Heading margin="size-0" level={4}>
                {breedDetail?.name}
              </Heading>
              <div style={{ width: "1.5rem" }}>
                <Heart
                  isActive={active}
                  onClick={() => {
                    setCount((c) => (active ? c - 1 : c + 1));
                    setActive(!active);
                    toggleFavorite(id);
                  }}
                />
              </div>
            </Flex>
            <Image
              src={`https://cdn2.thedogapi.com/images/${breedDetail?.reference_image_id}.jpg`}
              alt={breedDetail?.name || ""}
            />
            <Text>Bred For: {breedDetail?.bred_for}</Text>
            <Text>Breed Group: {breedDetail?.breed_group}</Text>
            <Text>
              Height: {breedDetail?.height.imperial} inches ({breedDetail?.height.metric} cm)
            </Text>
            <Text>
              Weight: {breedDetail?.weight.imperial} pounds ({breedDetail?.weight.metric} kg)
            </Text>
            <Text>Life Span: {breedDetail?.life_span}</Text>
            <Text>Origin: {breedDetail?.origin}</Text>
            <Text>Temperament: {breedDetail?.temperament}</Text>
          </Flex>
        </View>
      )}
    </>
  );
};

export default DogDetailsPage;
