
import { StyleSheet, Text, View, Pressable, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { blue } from '../constants';

const { width } = Dimensions.get('window');

const TabSelection = ({ selection, handleSetSelection,totalCount,todayCount=0 }) => {
  return (
    <View style={styles.tabContainer}>
      <Pressable
        style={[
          styles.tabButton,
          selection === 'today' && styles.activeTabButton,
        ]}
        onPress={() => handleSetSelection('today')}
      >
        <Text style={[styles.tabText, selection === 'today' && styles.activeTabText]}>
          Today <Text>({todayCount})</Text>
        </Text>
      </Pressable>
      <Pressable
        style={[
          styles.tabButton,
          selection === 'all' && styles.activeTabButton,
        ]}
        onPress={() => handleSetSelection('all')}
      >
        <Text style={[styles.tabText, selection === 'all' && styles.activeTabText]}>
        All <Text>({totalCount})</Text>
        </Text>
      </Pressable>
    </View>
  );
};

export default TabSelection;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    width: width - 40, // Ensure it fits the screen width
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  tabButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: blue,
    borderRadius: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '700',
  },
});
