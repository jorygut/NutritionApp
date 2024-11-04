import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, Button, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import BackButton from '../backButton';
import { useRouter } from 'expo-router';
import axios from 'axios';

const SeeDetails: React.FC = () => {
  //Declare routes and routers
  const route = useRoute();
  const router = useRouter();
  
  // Fetch meal data
  const [mealData, setMealData] = useState(route.params?.mealData);

  // Initialize state for total macros
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalFat, setTotalFat] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);

  // Calculate total macros when mealData changes
  useEffect(() => {
    if (mealData && mealData.foods) {
      const totalCalories = mealData.foods.reduce((sum, food) => sum + (food.calories || 0), 0);
      const totalProtein = mealData.foods.reduce((sum, food) => sum + (food.protein || 0), 0);
      const totalFat = mealData.foods.reduce((sum, food) => sum + (food.fat || 0), 0);
      const totalCarbs = mealData.foods.reduce((sum, food) => sum + (food.carbohydrates || 0), 0);

      // Set the calculated totals to state
      setTotalCalories(totalCalories);
      setTotalProtein(totalProtein);
      setTotalFat(totalFat);
      setTotalCarbs(totalCarbs);
    }
  }, [mealData]);

  //Remove food
  const RemoveFood = async (food, onComplete) => {
    try {
      await axios.post('http://127.0.0.1:5000/api/remove', {
        food: food,
      });
      onComplete();
    } catch (error) {
      console.log(error);
    }
  };

  //Load each food item
  const renderFoodItem = ({ item }) => {
    return (
      <FoodItem 
        food={item} 
        onRemove={() => {
          setMealData({
            ...mealData,
            foods: mealData.foods.filter((food) => food !== item)
          });
        }}
        removeFood={RemoveFood}
      />
    );
  };

  // Render food data and total macros
  return (
    <View style={styles.container}>
      <BackButton onPress={() => { router.push('/') }} />
      <View style={styles.totalsContainer}>
            <Text style={styles.totalsText}>Calories: {totalCalories.toFixed(1)}</Text>
            <Text style={styles.totalsText}>Protein: {totalProtein.toFixed(1)}g</Text>
            <Text style={styles.totalsText}>Fat: {totalFat.toFixed(1)}g</Text>
            <Text style={styles.totalsText}>Carbohydrates: {totalCarbs.toFixed(1)}g</Text>
      </View>
      
      {mealData && mealData.foods ? (
        <>
          <FlatList
            data={mealData.foods}
            renderItem={renderFoodItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </>
      ) : (
        <Text>No meal data available.</Text>
      )}
    </View>
  );
};

//Define food item and animation
const FoodItem = ({ food, onRemove, removeFood }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleRemove = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => removeFood(food, onRemove));
  };

  return (
    <Animated.View style={[styles.foodItem, { opacity: fadeAnim }]}>
      <Text style={styles.foodName}>{food.description}</Text>
      <Text>Servings: {food.selected_servings}</Text>
      <Text>Calories: {food.calories.toFixed(1)}</Text>
      <Text>Carbohydrates: {food.carbohydrates}</Text>
      <Text>Fat: {food.fat.toFixed(1)}</Text>
      <Text>Protein: {food.protein.toFixed(1)}</Text>
      <Text>Saturated Fat: {food.saturated_fat.toFixed(1)}</Text>
      <Text>Trans Fats: {food.trans_fat.toFixed(1)}</Text>
      <Text>Sugar: {food.sugars.toFixed(1)}</Text>
      <Text>Sodium: {food.sodium.toFixed(1)}</Text>
      <Text>Calcium: {food.calcium.toFixed(1)}</Text>
      <Text>Iron: {food.iron.toFixed(1)}</Text>
      {food.ingredients && (
        <Text>Ingredients: {food.ingredients}</Text>
      )}
      <View style={styles.remove}>
        <Button title='REMOVE' onPress={handleRemove} color='red' />
      </View>
    </Animated.View>
  );
};

//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  foodItem: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  foodName: {
    fontWeight: 'bold',
  },
  totalsContainer: {
    marginTop: 16,
  },
  totalsText: {
    fontSize: 16,
    fontWeight: 'bold',
    flexDirection: 'row'
  },
  remove: {
    position: 'relative',
    left: 130,
  }
});

export default SeeDetails;
