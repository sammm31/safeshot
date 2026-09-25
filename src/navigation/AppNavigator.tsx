import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { borderRadius } from '../theme/spacing';
import { shadows } from '../theme/shadows';
import { MainTabParamList, RootStackParamList } from './types';
import { useAuth } from '../services/authStore';

// Screens
import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { VialCheckScreen } from '../screens/VialCheckScreen';
import { RecordsScreen } from '../screens/RecordsScreen';
import { MoreScreen } from '../screens/MoreScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { InventoryScreen } from '../screens/InventoryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AboutScreen } from '../screens/AboutScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  // Safe bottom padding: Android 3-button nav bar is typically 48dp.
  // Ensure at least 28dp so Android system keys (Recent, Home, Back) never block tabs.
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 28 : 12);
  const tabBarHeight = 56 + bottomInset;

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: '#475569',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: tabBarHeight,
          paddingBottom: bottomInset,
          paddingTop: 6,
          elevation: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
        },
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      {/* 1. Home Dashboard */}
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

      {/* 2. Vial Check (Primary Center Action) */}
      <Tab.Screen
        name="VialCheckTab"
        component={VialCheckScreen}
        options={{
          tabBarLabel: 'Vial Check',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.centerIconWrapper}>
              <View
                style={[
                  styles.centerIconBadge,
                  focused && styles.centerIconBadgeActive,
                ]}
              >
                <Ionicons
                  name={focused ? 'scan-circle' : 'scan-circle-outline'}
                  size={24}
                  color={focused ? colors.textInverse : colors.navyPrimary}
                />
              </View>
            </View>
          ),
        }}
      />

      {/* 3. Records */}
      <Tab.Screen
        name="RecordsTab"
        component={RecordsScreen}
        options={{
          tabBarLabel: 'Records',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'document-text' : 'document-text-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* 4. More Options */}
      <Tab.Screen
        name="MoreTab"
        component={MoreScreen}
        options={{
          tabBarLabel: 'More',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={21}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {!isAuthenticated ? (
          /* Authentication Gate */
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              animation: 'fade',
            }}
          />
        ) : (
          /* Main Authenticated Application Stack */
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen
              name="Result"
              component={ResultScreen}
              options={{
                animation: 'fade_from_bottom',
              }}
            />
            <Stack.Screen
              name="Inventory"
              component={InventoryScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="About"
              component={AboutScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  tabBarItem: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -4,
  },
  centerIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  centerIconBadgeActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    elevation: 6,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
});
