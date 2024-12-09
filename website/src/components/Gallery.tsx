"use client";
import { useImageDimensions } from "../hooks/useImageDimensions";
import PhotoGrid from "./PhotoGrid";
import { useSuspenseQuery } from "@tanstack/react-query";

const mockImages = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1496871455396-14e56815f1f4?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    width: 0,
    height: 0,
  },
  {
    id: "2",
    url: "https://plus.unsplash.com/premium_photo-1682656220562-32fde8256295?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    width: 0,
    height: 0,
  },
  {
    id: "3",
    url: "https://plus.unsplash.com/premium_photo-1672116452571-896980a801c8?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    width: 0,
    height: 0,
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    width: 0,
    height: 0,
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    width: 0,
    height: 0,
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1422360902398-0a91ff2c1a1f?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    width: 0,
    height: 0,
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    width: 0,
    height: 0,
  },
  {
    id: "8",
    url: "https://plus.unsplash.com/premium_photo-1674309438579-587b58d8486e?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    width: 0,
    height: 0,
  },
  {
    id: "9",
    url: "https://plus.unsplash.com/premium_photo-1669927131902-a64115445f0f?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    width: 0,
    height: 0,
  },
  {
    id: "10",
    url: "https://plus.unsplash.com/premium_photo-1682048358672-1c5c6c9ed2ae?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    width: 0,
    height: 0,
  },
  {
    id: "11",
    url: "https://images.unsplash.com/photo-1465447142348-e9952c393450?q=80&w=650&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    width: 0,
    height: 0,
  },
];

function Gallery() {
  //   const { data } = useSuspenseQuery({
  //     queryKey: ["photos"],
  //     queryFn: () =>
  //       fetch("https://fake-api.com/photos").then((res) => res.json()),
  //   });
  //   console.log(data);
  const calc = useImageDimensions(mockImages);
  return <PhotoGrid photos={calc} />;
}

export default Gallery;
