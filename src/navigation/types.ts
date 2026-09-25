import { NavigatorScreenParams } from '@react-navigation/native';
import { InspectionResult, WireInspectionResult } from '../types/inspection';

export type MainTabParamList = {
  HomeTab: undefined;
  VialCheckTab: { preselectedBatchId?: string } | undefined;
  RecordsTab: undefined;
  MoreTab: undefined;
  // Aliases for backwards compatibility
  CheckWireTab?: undefined;
  HistoryTab?: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Result: { inspection: InspectionResult };
  Inventory: undefined;
  Profile: undefined;
  Settings: undefined;
  About: undefined;
  VialCheckModal: { preselectedBatchId?: string } | undefined;
};
