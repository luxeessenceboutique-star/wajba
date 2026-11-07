/** 11 · Mon compte — placeholder until phase 5, with the links needed to test phase 2. */
import { router } from "expo-router";

import { ListRow, TabPlaceholder, Text } from "@/components";
import { t } from "@/i18n";
import { useUserStore } from "@/store/user";
import { profiles as allProfiles } from "@/data/home";

export default function AccountScreen() {
  const name = useUserStore((s) => s.name);
  const phone = useUserStore((s) => s.phone);
  const picked = useUserStore((s) => s.profiles);
  const signOut = useUserStore((s) => s.signOut);
  const profileNames = allProfiles.filter((p) => picked.includes(p.id)).map((p) => p.name).join(", ");

  return (
    <TabPlaceholder title={t("placeholder.accountTitle")} text={t("placeholder.accountText")} icon="user">
      <Text variant="cardTitle">{name}</Text>
      {phone && (
        <Text variant="bodySmall" color="muted">
          {phone}
        </Text>
      )}
      <ListRow icon="user" label={t("placeholder.editProfiles")} value={profileNames || undefined} onPress={() => router.push({ pathname: "/profile", params: { from: "account" } })} />
      <ListRow icon="leaf" label={t("placeholder.gallery")} onPress={() => router.push("/dev")} />
      <ListRow
        icon="chevronLeft"
        label={t("placeholder.signOut")}
        divider={false}
        onPress={() => {
          signOut();
          if (router.canDismiss()) router.dismissAll();
          router.replace("/");
        }}
      />
    </TabPlaceholder>
  );
}
