import React from 'react';
import { Box } from './ui/box';
import { Text } from './ui/text';
import Markdown from 'react-native-markdown-display';

interface RecipeCardProps {
  recipeMarkdown: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipeMarkdown }) => {
  return (
    <Box bg="$backgroundDark900" borderRadius="$lg" p="$4" mb="$4">
      <Markdown
        style={{
          heading1: { color: '$textLight50', fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
          heading2: { color: '$textLight100', fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
          paragraph: { color: '$textLight200', fontSize: 16, marginBottom: 8 },
          listItem: { color: '$textLight200', fontSize: 16, marginBottom: 4 },
          listUnorderedItemIcon: { color: '$textLight200' },
          listOrderedItemIcon: { color: '$textLight200' },
        }}
      >
        {recipeMarkdown}
      </Markdown>
    </Box>
  );
};

export default RecipeCard;