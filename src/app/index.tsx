import { Redirect } from "expo-router";

// Phase 1: the app opens on the component gallery.
// Phase 2 replaces this with the Splash / Login screen.
export default function Index() {
  return <Redirect href="/dev" />;
}
