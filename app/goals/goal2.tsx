import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Button, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import BackButton from '../backButton';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import LineGraph from './LineChart';
import { useNavigation, useRoute } from '@react-navigation/native';

const Goal2: React.FC = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [dailyWeight, setDailyWeight] = useState('');
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const currentDate = `${day}-${month}-${year}`;
  
  const handlePress = (value: string) => {
    setDailyWeight((prev) => prev + value);
  };

  const handleDelete = () => {
    setDailyWeight((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setDailyWeight('');
  };

  const updateWeight = async () => {
    const token = await SecureStore.getItemAsync('userToken');
    if (!token) {
      console.error('No token found');
      return null;
    }
    try {
      const weight = parseFloat(dailyWeight);
      if (isNaN(weight)) {
        console.error('Invalid weight value');
        return null;
      }

      const response = await axios.post('http://127.0.0.1:5000/api/logWeight', 
        { weight }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.error('Error logging weight:', error);
      return null;
    }
  };

  const retrieveWeights = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get('http://127.0.0.1:5000/api/retreiveWeight', config);
      if (response.status === 200) {
        const weights = response.data;
        console.log('Retrieved weights:', weights);
        return weights;
      } else {
        console.log('Failed to retrieve weights:', response.status);
      }
    } catch (error) {
      console.error('Error retrieving weights:', error);
    }
  };

  useEffect(() => {
    const data = retrieveWeights();
  }, []);

  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.back}>
        <BackButton onPress={() => router.push('/')} />
      </View>
      <TextInput
        value={dailyWeight}
        placeholder="Enter Weight"
        style={styles.weightInput}
        keyboardType="numeric"
        editable={false}
      />
      <TouchableOpacity onPress={() => navigation.navigate('settings/calendar', {data: 'weightLogs'})}>
        <Text>{currentDate}</Text>
      </TouchableOpacity>
      <View style={styles.keypad}>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => handlePress('1')} style={styles.key}>
            <Text style={styles.keyText}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePress('2')} style={styles.key}>
            <Text style={styles.keyText}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePress('3')} style={styles.key}>
            <Text style={styles.keyText}>3</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => handlePress('4')} style={styles.key}>
            <Text style={styles.keyText}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePress('5')} style={styles.key}>
            <Text style={styles.keyText}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePress('6')} style={styles.key}>
            <Text style={styles.keyText}>6</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => handlePress('7')} style={styles.key}>
            <Text style={styles.keyText}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePress('8')} style={styles.key}>
            <Text style={styles.keyText}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePress('9')} style={styles.key}>
            <Text style={styles.keyText}>9</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => handlePress('.')} style={styles.key}>
            <Text style={styles.keyText}>.</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePress('0')} style={styles.key}>
            <Text style={styles.keyText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.key}>
            <Text style={styles.keyText}>DEL</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={handleClear} style={[styles.key, styles.clearButton]}>
            <Text style={styles.keyText}>C</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={updateWeight} style={styles.logButton}>
        <Text style={styles.logText}>Log Weight</Text>
      </TouchableOpacity>
      <LineGraph />
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  back: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  weightInput: {
    width: '80%',
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    fontSize: 16,
  },
  keypad: {
    width: '80%',
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  key: {
    width: '30%',
    height: 50,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    margin: 5,
  },
  keyText: {
    fontSize: 18,
  },
  clearButton: {
    backgroundColor: '#ff6f6f', // Red background for clear button
  },
  logButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#4CAF50', // Green background
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  logText: {
    color: 'white',
    fontSize: 18,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20,
  },
  timeRangeButton: {
    width: '30%',
    backgroundColor: '#4682B4',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  timeRangeText: {
    color: 'white',
    fontSize: 14,
  },
});

export default Goal2;