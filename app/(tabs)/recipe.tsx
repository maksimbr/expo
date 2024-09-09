import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  FlatList, 
  ScrollView,
  Alert, 
} from 'react-native';
import axios from 'axios';
import { useImgContext } from '../../hooks/providers/imageContext';

const smth = '';

export default function RecipeScreen({ route }) {
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { capturedImage } = useImgContext();

  useEffect(() => {
    const generateRecipe = async () => {
      setIsLoading(true);

      try {
        // 1. Image Analysis using OpenAI Vision API
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
                      detail:"high"
                    },
                  },
                ],
              },
            ],
            max_tokens: 2700, 
          },
          {
            headers: {
              'Authorization': `Bearer ${smth}`,
              'Content-Type': 'application/json', 
            }
          }
        );

        // Assuming OpenAI returns a comma-separated list 
        const identifiedIngredients = visionApiResponse.data.choices[0].message.content.split(',');

         // Update the ingredients state 
         setIngredients(identifiedIngredients.map(ingredient => ingredient.trim()));

        // 2. Advanced Recipe Generation Prompt 
        const recipePrompt = `
        Based on a detailed analysis of these ingredients: ${identifiedIngredients}, provide 3 healthy and delicious recipes. 

        For each recipe, include:
        - Recipe Title
        - A short description (about 1 sentence).
        - Ingredients list (formatted for easy reading).
        - Clear and concise instructions.
        `;

        // 3. Recipe Generation with OpenAI Text API
        const recipeGenerationResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions', 
            {
              model: 'gpt-4-turbo',
              messages: [
                {
                  role: 'user',
                  content: [
                    { type: 'text', text: recipePrompt },
                  ],
                },
              ],
              max_tokens: 2700, 
            },
            {
              headers: {
                'Authorization': `Bearer ${smth}`,
                'Content-Type': 'application/json', 
              }
            }
          );

        setRecipe(recipeGenerationResponse.data.choices[0].message.content?.trim());
      } catch (error) {
        console.error('Error generating recipe:', error);
        Alert.alert('Error', 'Could not generate a recipe. Please try again.'); 
      } finally {
        setIsLoading(false);
      }
    };

    generateRecipe();
  }, [capturedImage]); 

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No recipe found. Please try again.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {ingredients.length > 0 && (
          <View style={styles.ingredientsSection}>
            <Text style={styles.sectionTitle}>Ingredients:</Text>
            <FlatList
              data={ingredients}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Text style={styles.ingredientItem}>- {item}</Text>
              )}
            />
          </View>
        )}

        <View style={styles.recipeSection}>
          <Text style={styles.sectionTitle}>Recipes:</Text>
          <Text style={styles.recipeText}>{recipe}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollContent: {
    padding: 20,
  },
  ingredientsSection: {
    marginBottom: 20,
  },
  recipeSection: {
    // Add styling as needed
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ingredientItem: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  recipeText: {
    color: 'white',
    fontSize: 16,
  },
  // ... other styles
});
