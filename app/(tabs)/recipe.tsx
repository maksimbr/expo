import React, { useState, useEffect } from 'react';
import { FlatList, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { Box } from "../../components/ui/box"
import { Text } from "../../components/ui/text"
import { Spinner } from "../../components/ui/spinner"
import { VStack } from "../../components/ui/vstack"
import { useImgContext } from '../../hooks/providers/imageContext';
import Markdown from 'react-native-markdown-display';
import RecipeCard from '../../components/RecipeCard';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

export default function RecipeScreen() {
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { capturedImage } = useImgContext();

  useEffect(() => {
    const generateRecipe = async () => {
      setIsLoading(true);

      if(capturedImage) {
        try {
            // Image Analysis using OpenAI Vision API
            const visionApiResponse = await axios.post(
              'https://api.openai.com/v1/chat/completions',
              {
                model: 'gpt-4-turbo',
                messages: [
                  {
                    role: 'user',
                    content: [
                      { type: 'text', text: 'What ingredients do you see in this image?' },
                      {
                        type: 'image_url',
                        image_url: {
                          url: capturedImage,
                          detail: "high"
                        },
                      },
                    ],
                  },
                ],
                max_tokens: 300,
              },
              {
                headers: {
                  'Authorization': `Bearer ${OPENAI_API_KEY}`,
                  'Content-Type': 'application/json',
                }
              }
            );
    
            const identifiedIngredients = visionApiResponse.data.choices[0].message.content.split(',');
            setIngredients(identifiedIngredients.map(ingredient => ingredient.trim()));
    
            // Recipe Generation with OpenAI Text API
            const recipePrompt = `
            Based on these ingredients: ${identifiedIngredients.join(', ')}, provide 3 healthy and delicious recipes.
    
            For each recipe, use the following Markdown format:
            # Recipe Title
            
            Short description (about 1 sentence).
    
            ## Ingredients
            - Ingredient 1
            - Ingredient 2
            ...
    
            ## Instructions
            1. Step 1
            2. Step 2
            ...
    
            Separate each recipe with '---'.
            `;
    
            const recipeGenerationResponse = await axios.post(
              'https://api.openai.com/v1/chat/completions',
              {
                model: 'gpt-4-turbo',
                messages: [
                  {
                    role: 'user',
                    content: recipePrompt,
                  },
                ],
                max_tokens: 2000,
              },
              {
                headers: {
                  'Authorization': `Bearer ${OPENAI_API_KEY}`,
                  'Content-Type': 'application/json',
                }
              }
            );
    
            const generatedRecipes = recipeGenerationResponse.data.choices[0].message.content.split('---').map(recipe => recipe.trim());
            setRecipes(generatedRecipes);
          } catch (error) {
            console.error('Error generating recipe:', error);
            Alert.alert(
              "Error",
              "Could not generate recipes. Please try again.",
            );
          } finally {
            setIsLoading(false);
          }
      }

    
    };

    generateRecipe();
  }, [capturedImage]);

  if (isLoading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="$backgroundDark950">
        <Spinner size="large" />
      </Box>
    );
  }

  if (recipes.length === 0) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="$backgroundDark950">
        <Text color="$textLight50">No recipes found. Please try again.</Text>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="$backgroundDark950" p="$4">
      <ScrollView>
        <VStack space="md">
          <Box>
            <Text fontSize="$xl" fontWeight="$bold" color="$textLight50" mb="$2">Identified Ingredients:</Text>
            <FlatList
              data={ingredients}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Text color="$textLight200">• {item}</Text>
              )}
              scrollEnabled={false}
            />
          </Box>
          <Text fontSize="$xl" fontWeight="$bold" color="$textLight50" mb="$2">Generated Recipes:</Text>
          {recipes.map((recipe, index) => (
            <RecipeCard key={index} recipeMarkdown={recipe} />
          ))}
        </VStack>
      </ScrollView>
    </Box>
  );
}
