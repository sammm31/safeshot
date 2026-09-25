import { NavigatorScreenParams } from '@react-navigation/native';
import { WireInspectionResult } from '../types/inspection';

export type MainTabParamList = {
  HomeTab: undefined;
  CheckWireTab: undefined;
  HistoryTab: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Result: { inspection: WireInspectionResult };
  About: undefined;
};
