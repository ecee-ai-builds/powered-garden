import { useState } from 'react';

export const usePlantImageGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPlantImage, setCurrentPlantImage] = useState<string | null>(null);
  const [currentPlantName, setCurrentPlantName] = useState<string>("");

  const generatePlantImage = async (plantName: string): Promise<string | null> => {
    if (!plantName || isGenerating) return null;

    setIsGenerating(true);
    setCurrentPlantName(plantName);

    try {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [
            {
              role: "user",
              content: `Generate a clean, simple line art botanical illustration of ${plantName}. Orange colored outlines (#FF6B35), no fill, transparent background. Minimalist style showing the characteristic leaves or plant structure. Pure line drawing with no shading or background.`
            }
          ],
          modalities: ["image", "text"]
        })
      });

      if (!response.ok) {
        console.error("Image generation failed:", response.status);
        return null;
      }

      const data = await response.json();
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (imageUrl) {
        setCurrentPlantImage(imageUrl);
        return imageUrl;
      }

      return null;
    } catch (error) {
      console.error("Error generating plant image:", error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatePlantImage,
    isGenerating,
    currentPlantImage,
    currentPlantName,
  };
};
