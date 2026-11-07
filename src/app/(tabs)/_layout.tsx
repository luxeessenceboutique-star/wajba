/** Main tabs — Accueil · Ma semaine · Commandes · Compte (DESIGN_SPEC §3 · TabBar, §4). */
import { Tabs, type BottomTabBarProps } from "expo-router/js-tabs";

import { TabBar, type TabKey } from "@/components";

function RouterTabBar({ state, navigateToTab }: BottomTabBarProps) {
  const active = state.routes[state.index]?.name as TabKey;
  return (
    <TabBar
      activeKey={active}
      onSelect={(key) => {
        const route = state.routes.find((r) => r.name === key);
        if (route) navigateToTab(route.key);
      }}
    />
  );
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <RouterTabBar {...props} />}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="plan" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="account" />
    </Tabs>
  );
}
