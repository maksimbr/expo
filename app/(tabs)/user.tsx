import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  TextInput,
  ScrollView,
  Alert,// For dropdown/selector
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons'; // For icons 

export default function UserScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false); 
  const [dietPreference, setDietPreference] = useState('None');
  const [allergies, setAllergies] = useState('');
  const [foodDislikes, setFoodDislikes] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [heightUnits, setHeightUnits] = useState('cm');
  const [weight, setWeight] = useState('');
  const [weightUnits, setWeightUnits] = useState('kg');
  const [activityLevel, setActivityLevel] = useState('Sedentary');

  // Placeholder for errors 
  const [nameError, setNameError] = useState('');   const [emailError, setEmailError] = useState('');

  const handleSaveSettings = () => {
     // Basic input validation (example)
    if (name.trim() === '') {
      setNameError('Name is required'); 
      return; // Stop if there's an error
    } else {
      setNameError(''); // Clear error if valid
    }

    if (email.trim() === '' || !isValidEmail(email)) {
      setEmailError('Valid email is required'); 
      return; 
    } else {
      setEmailError(''); 
    }
   
    // 1. (TODO) Make API call to your backend to save data
    // Example using fetch or axios: 

    // 2. Show success message after successful API call
    Alert.alert('Success', 'Your settings have been saved!');
  };

  // Helper function for email validation
  const isValidEmail = (email) => {
    // You can use a more robust email validation regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.screenTitle}>Settings</Text> 

      {/* Profile */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={name}
            onChangeText={setName}
          />
          {nameError !== '' && <Text style={styles.errorText}>{nameError}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            placeholder="your.email@example.com" 
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address" 
          />
          {emailError !== '' && <Text style={styles.errorText}>{emailError}</Text>}
        </View>
      </View>

      {/* Subscription */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.label}>ChefAI Premium:</Text>
          <Switch
            value={isSubscribed}
            onValueChange={setIsSubscribed}
            trackColor={{ false: '#767577', true: '#00c853' }}
            thumbColor={isSubscribed ? '#00e676' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Diet Preferences</Text>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Preferred Diet:</Text>
          <Picker
            selectedValue={dietPreference}
            onValueChange={(itemValue) => setDietPreference(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="None" value="None" />
            <Picker.Item label="Vegetarian" value="Vegetarian" />
            <Picker.Item label="Vegan" value="Vegan" />
            <Picker.Item label="Ketogenic" value="Ketogenic" />
            {/* Add more diet options */}
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Allergies:</Text>
          <TextInput
            style={styles.input}
            placeholder="List any allergies (e.g., peanuts, dairy)"
            value={allergies}
            onChangeText={setAllergies}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Food Dislikes:</Text>
          <TextInput
            style={styles.input}
            placeholder="List any food dislikes (e.g., mushrooms, onions)"
            value={foodDislikes}
            onChangeText={setFoodDislikes}
          />
        </View>
      </View>

      {/* Personal Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Details</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Age:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            value={age}
            onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ''))} // Only allow numbers
            keyboardType="numeric" 
          />
        </View>

        <View style={styles.dualInputContainer}>
          <View style={styles.heightInputContainer}>
            <Text style={styles.label}>Height:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter height"
              value={height}
              onChangeText={(text) => setHeight(text.replace(/[^0-9]/g, ''))} // Only allow numbers
              keyboardType="numeric"
            />
          </View>
          <Picker
            selectedValue={heightUnits}
            onValueChange={(itemValue) => setHeightUnits(itemValue)}
            style={styles.unitPicker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="cm" value="cm" />
            <Picker.Item label="in" value="in" />
          </Picker>
        </View>

        <View style={styles.dualInputContainer}>
          <View style={styles.weightInputContainer}>
            <Text style={styles.label}>Weight:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter weight"
              value={weight}
              onChangeText={(text) => setWeight(text.replace(/[^0-9]/g, ''))} // Only allow numbers
              keyboardType="numeric"
            />
          </View>
          <Picker
            selectedValue={weightUnits}
            onValueChange={(itemValue) => setWeightUnits(itemValue)}
            style={styles.unitPicker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="kg" value="kg" />
            <Picker.Item label="lbs" value="lbs" />
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Activity Level:</Text>
          <Picker
            selectedValue={activityLevel}
            onValueChange={(itemValue) => setActivityLevel(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Sedentary" value="Sedentary" />
            <Picker.Item label="Lightly Active" value="Lightly Active" />
            <Picker.Item label="Moderately Active" value="Moderately Active" />
            <Picker.Item label="Very Active" value="Very Active" />
            <Picker.Item label="Extremely Active" value="Extremely Active" />
          </Picker>
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 50,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 20,
    backgroundColor: '#f5f5f5', // Light background for Material Design
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', 
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10, // Rounded corners
    elevation: 2, // Subtle shadow for elevation (Android)
    shadowColor: '#000', // Shadow (iOS)
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
  },
  dualInputContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 15,
  },
  heightInputContainer: {
    flex: 1, 
    marginRight: 10, 
  },
  weightInputContainer: { // Similar to heightInputContainer
    flex: 1, 
    marginRight: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    marginBottom: 15, 
  },
  picker: {
    height: 50, 
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  unitPicker: { 
    height: 50,
    width: 80, 
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5, 
  },
  pickerItem: {
    fontSize: 16,
    color: '#333', 
  },
  saveButton: {
    backgroundColor: 'black', 
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
});