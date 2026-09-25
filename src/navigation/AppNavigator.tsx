import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { shadows } from '../theme/shadows';
import { MainTabParamList, RootStackParamList } from './types';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { CheckWireScreen } from '../screens/CheckWireScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { AboutScreen } from '../screens/AboutScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="CheckWireTab"
        component={CheckWireScreen}
        options={{
          tabBarLabel: 'Check Wire',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.centerIconWrapper}>
              <View
                style={[
                  styles.centerIconBadge,
                  focused && styles.centerIconBadgeActive,
                ]}
              >
                <Ionicons
                  name={focused ? 'scan' : 'scan-outline'}
                  size={20}
                  color={focused ? colors.textInverse : colors.navyPrimary}
                />
              </View>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="HistoryTab"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'time' : 'time-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{
            animation: 'fade_from_bottom',
          }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: Platform.OS === 'ios' ? 86 : 64,
    paddingBottom: Platform.OS === 'ios' ? 26 : 8,
    paddingTop: 8,
    ...shadows.floating,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  tabBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  centerIconBadgeActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
});
