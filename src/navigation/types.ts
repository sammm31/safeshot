import { NavigatorScreenParams } from '@react-navigation/native';
import { InspectionResult, WireInspectionResult } from '../types/inspection';

export type MainTabParamList = {
  HomeTab: undefined;
  CheckWireTab: undefined;
  HistoryTab: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Result: { inspection: InspectionResult };
  About: undefined;
};
